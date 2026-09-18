#pragma once
#define CEF_STUB_OPENSSL 1
#define MD5_DIGEST_LENGTH 16
inline unsigned char* MD5(const unsigned char* d, size_t n, unsigned char* md){ if(md) for(int i=0;i<16;i++) md[i]=0; return md; }
