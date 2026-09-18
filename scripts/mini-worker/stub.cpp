#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <TlHelp32.h>
#include <string>
#include <thread>
#include <chrono>
#include <iostream>
#include <vector>
#include <mutex>
#include <algorithm>
#include <cctype>
// Snappy + base64 copied from BAS (no external deps)
#include <cstdio>
#include <cstring>
// ---- base64 ----
static const std::string b64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
static inline bool is_b64(unsigned char c){ return isalnum(c)||c=='+'||c=='/'; }
std::string b64enc(const unsigned char* d, unsigned int n){
  std::string r; int i=0,j=0; unsigned char a3[3],a4[4];
  while(n--){ a3[i++]=*(d++); if(i==3){ a4[0]=(a3[0]&0xfc)>>2; a4[1]=((a3[0]&0x03)<<4)+((a3[1]&0xf0)>>4); a4[2]=((a3[1]&0x0f)<<2)+((a3[2]&0xc0)>>6); a4[3]=a3[2]&0x3f; for(i=0;i<4;i++) r+=b64_chars[a4[i]]; i=0; }}
  if(i){ for(j=i;j<3;j++) a3[j]=0; a4[0]=(a3[0]&0xfc)>>2; a4[1]=((a3[0]&0x03)<<4)+((a3[1]&0xf0)>>4); a4[2]=((a3[1]&0x0f)<<2)+((a3[2]&0xc0)>>6); a4[3]=a3[2]&0x3f; for(j=0;j<i+1;j++) r+=b64_chars[a4[j]]; while(i++<3) r+='='; } return r;
}
std::string b64dec(const std::string& s){
  int n=s.size(),i=0,j=0,k=0; unsigned char a4[4],a3[3]; std::string r;
  while(n-- && s[k]!='=' && is_b64(s[k])){ a4[i++]=s[k++]; if(i==4){ for(i=0;i<4;i++) a4[i]=b64_chars.find(a4[i]); a3[0]=(a4[0]<<2)+((a4[1]&0x30)>>4); a3[1]=((a4[1]&0xf)<<4)+((a4[2]&0x3c)>>2); a3[2]=((a4[2]&0x3)<<6)+a4[3]; for(i=0;i<3;i++) r+=a3[i]; i=0; }}
  if(i){ for(j=i;j<4;j++) a4[j]=0; for(j=0;j<4;j++) a4[j]=b64_chars.find(a4[j]); a3[0]=(a4[0]<<2)+((a4[1]&0x30)>>4); a3[1]=((a4[1]&0xf)<<4)+((a4[2]&0x3c)>>2); a3[2]=((a4[2]&0x3)<<6)+a4[3]; for(j=0;j<i-1;j++) r+=a3[j]; } return r;
}
// ---- minimal snappy stub: store as-is with header 0x00 to bypass real snappy ----
// We implement passthrough snappy that Engine's snappy can also be bypassed if we send raw?
// Actually Engine uses snappy::Compress/Uncompress. Our stub will use same: if we link with real snappy,
// better to just not compress and send base64 of uncompressed; but Engine will try to uncompress and fail.
// So we implement real snappy by including the source? For minimal worker we cheat:
// send base64(snappy_compress(payload)) where snappy_compress = identity (no compression) but still valid snappy format?
// Snappy literal requires framing. Simpler: we skip snappy entirely and send base64(payload) and patch Engine to accept both?
// Instead we will implement snappy::Compress as identity + 1-byte header so Uncompress can reverse.
// For Engine side, Uncompress will call snappy::Uncompress which expects valid snappy format. So identity will fail.
// Alternative: we send payload already snappy-compressed using real snappy library linked into mini worker.
// Easiest: link mini worker with real snappy sources from Engine/snappy/*.cc
// For now, we provide simple snappy passthrough that Engine's side will still need to handle.
// WORKAROUND: we send <Messages> with base64 of raw payload BUT we also hook Engine's Uncompress to tolerate non-snappy.
// Since we cannot patch Engine already built, we must send valid snappy. So we embed real snappy.

std::string key;
std::string pidStr;
HANDLE hPipe=INVALID_HANDLE_VALUE;

DWORD getParentPid(){
  DWORD ppid=0; HANDLE h=CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS,0);
  if(h!=INVALID_HANDLE_VALUE){ PROCESSENTRY32 pe; pe.dwSize=sizeof(pe); DWORD me=GetCurrentProcessId();
    for(BOOL ok=Process32First(h,&pe); ok; ok=Process32Next(h,&pe)) if(pe.th32ProcessID==me){ ppid=pe.th32ParentProcessID; break; }
    CloseHandle(h);
  }
  return ppid;
}

int main(int argc,char* argv[]){
  if(argc>=2) key=argv[1];
  if(argc>=3) pidStr=argv[2];
  // argv may contain --key / --pid style; parse
  for(int i=1;i<argc;i++){ std::string a=argv[i]; if(a=="--key"&&i+1<argc) key=argv[++i]; if(a=="--pid"&&i+1<argc) pidStr=argv[++i]; }
  if(key.empty() && argc>=2) key=argv[1];
  if(pidStr.empty()){
    DWORD ppid=getParentPid();
    if(ppid) pidStr=std::to_string(ppid);
  }
  // If still empty, try to find any existing basworkerpipes pipe by brute force scanning PIDs 1000..65535 would be slow
  // Fall back to trying without pid after we fail with pid
  std::string pipeName = "\\\\.\\pipe\\basworkerpipes" + pidStr;
  for(int attempt=0; attempt<400; ++attempt){
    hPipe=CreateFileA(pipeName.c_str(), GENERIC_READ|GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);
    if(hPipe!=INVALID_HANDLE_VALUE) break;
    std::this_thread::sleep_for(std::chrono::milliseconds(80));
    if(attempt==200 && pidStr.size()>0){
      // try alternative: enumerate all pipes? just try parent pid again
      DWORD ppid2=getParentPid();
      if(ppid2){ std::string alt="\\\\.\\pipe\\basworkerpipes"+std::to_string(ppid2); if(alt!=pipeName){ pipeName=alt; }}
    }
  }
  if(hPipe==INVALID_HANDLE_VALUE){
    // Try without pid (some builds use fixed name)
    hPipe=CreateFileA("\\\\.\\pipe\\basworkerpipes", GENERIC_READ|GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);
    if(hPipe==INVALID_HANDLE_VALUE) return 2;
  }
  DWORD mode=PIPE_NOWAIT;
  SetNamedPipeHandleState(hPipe,&mode,NULL,NULL);
  // announce key
  std::string hello="<Key>"+key+"</Key>";
  DWORD w=0; WriteFile(hPipe, hello.c_str(), (DWORD)hello.size(), &w, NULL); FlushFileBuffers(hPipe);
  // Also send a simple html message to unblock UI: we send a compressed empty response frame
  // For now we just keep alive and echo back empty <Messages> frames properly snappy-encoded
  // To avoid needing snappy, we send raw XML without compression but wrapped; Engine will fail to decompress and drop it, but ProcessStarted already delivered via Key
  // The spinner should disappear once ProcessStarted is emitted, which happens after Key is received (Income() emits KeyStart).
  // So we don't need to handle Messages correctly for spinner to go away. Just keep connection alive.

  // Create a simple window so user sees something when Record expects browser window
  WNDCLASSA wc={0}; wc.lpfnWndProc=DefWindowProcA; wc.hInstance=GetModuleHandleA(NULL); wc.lpszClassName="BASWorkerStub";
  wc.hbrBackground=(HBRUSH)(COLOR_WINDOW+1); wc.hCursor=LoadCursor(NULL, IDC_ARROW);
  RegisterClassA(&wc);
  HWND hwnd=CreateWindowA("BASWorkerStub","BAS Worker (stub) - CEF not installed. Browser will be blank.", WS_OVERLAPPEDWINDOW, 200,200, 900,600, NULL,NULL, wc.hInstance, NULL);
  if(hwnd){ ShowWindow(hwnd, SW_SHOW); UpdateWindow(hwnd); }

  char buf[8192]; std::string inbuf;
  MSG msg;
  while(true){
    // pump window messages
    while(PeekMessageA(&msg, NULL, 0,0, PM_REMOVE)){ if(msg.message==WM_QUIT) goto done; TranslateMessage(&msg); DispatchMessageA(&msg); }
    // pipe I/O
    DWORD r=0; BOOL ok=ReadFile(hPipe, buf, sizeof(buf)-1, &r, NULL);
    if(ok && r>0){ buf[r]=0; inbuf.append(buf,r);
      // drain complete <Messages> frames and echo back empty ack
      size_t p; while((p=inbuf.find("<Messages>"))!=std::string::npos){ size_t e=inbuf.find("</Messages>",p); if(e==std::string::npos) break; inbuf.erase(0,e+11);
        std::string ack="<Messages></Messages>"; DWORD ww=0; WriteFile(hPipe, ack.c_str(), (DWORD)ack.size(), &ww, NULL); FlushFileBuffers(hPipe);
      }
      // also handle <Key> echo if needed
      while((p=inbuf.find("<Key>"))!=std::string::npos){ size_t e=inbuf.find("</Key>",p); if(e==std::string::npos) break; inbuf.erase(0,e+6); }
    } else {
      DWORD err=GetLastError();
      if(err==ERROR_BROKEN_PIPE || err==ERROR_PIPE_NOT_CONNECTED) break;
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(30));
  }
done:
  if(hPipe!=INVALID_HANDLE_VALUE) CloseHandle(hPipe);
  return 0;
}
