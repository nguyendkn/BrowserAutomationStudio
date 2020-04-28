#include "settings.h"
#include <iostream>
#include <fstream>
#include "picojson.h"
#include <string>
#include <split.h>
#include "readallfile.h"
#include "replaceall.h"
#include "startwith.h"
#include "converter.h"
#include "fileutils.h"
#include "log.h"

settings::settings()
{
    no_embedded = false;
    Init();
}

void settings::Init()
{
    use_flash = false;
    force_utf8 = true;
    skip_frames = 1;
    canvas = "disable";
    audio = "disable";
    webrtc = "disable";
    webgl = "disable";
    toolbox_height = 300;
    scenario_width = 500;
    zoom = 100;
    max_browser_start_simultaneously = 1;
    min_free_memory_to_start_browser = 500;
    min_unused_cpu = 0;
    maximized = false;
    restart = true;
    emulate_mouse = true;
    proxies_reconnect = false;
    autostart_debug = false;
    debug_toolbox = false;
    debug_scenario = false;
    tunneling = true;
    detector = true;
    std::ifstream fin("settings_worker.ini");
    if(fin.is_open())
    {
        std::string line;
        while(std::getline(fin, line))
        {
            if(line.find("DebugToolbox=true") != std::string::npos)
            {
                debug_toolbox = true;
            }
            if(line.find("DebugScenario=true") != std::string::npos)
            {
                debug_scenario = true;
            }
            if(line.find("ForceUtf8=false") != std::string::npos)
            {
                force_utf8 = false;
            }
            if(line.find("IsSafe=false") != std::string::npos)
            {
                canvas = "enable";
                webrtc = "enable";
                audio = "enable";
            }
            if(line.find("IsSafe=true") != std::string::npos)
            {
                canvas = "disable";
                webrtc = "disable";
                audio = "disable";
            }
            if(line.find("Canvas=") != std::string::npos)
            {
                canvas = ReplaceAll(line,"Canvas=","");
                canvas = ReplaceAll(canvas,"\"","");
            }
            if(line.find("CanvasNoise=") != std::string::npos)
            {
                canvas_noise = ReplaceAll(line,"CanvasNoise=","");
                canvas_noise = ReplaceAll(canvas_noise,"\"","");
            }
            if(line.find("Audio=") != std::string::npos)
            {
                audio = ReplaceAll(line,"Audio=","");
                audio = ReplaceAll(audio,"\"","");
            }
            if(line.find("AudioNoise=") != std::string::npos)
            {
                audio_noise = ReplaceAll(line,"AudioNoise=","");
                audio_noise = ReplaceAll(audio_noise,"\"","");
            }
            if(line.find("Webrtc=") != std::string::npos)
            {
                webrtc = ReplaceAll(line,"Webrtc=","");
                webrtc = ReplaceAll(webrtc,"\"","");
            }
            if(line.find("Webgl=") != std::string::npos)
            {
                webgl = ReplaceAll(line,"Webgl=","");
                webgl = ReplaceAll(webgl,"\"","");
            }
            if(line.find("WebglNoise=") != std::string::npos)
            {
                webgl_noise = ReplaceAll(line,"WebglNoise=","");
                webgl_noise = ReplaceAll(webgl_noise,"\"","");
            }
            if(line.find("WebrtcIps=") != std::string::npos)
            {
                webrtc_ips = ReplaceAll(line,"WebrtcIps=","");
                webrtc_ips = ReplaceAll(webrtc_ips,"\"","");
            }
            if(line.find("WebglRenderer=") != std::string::npos)
            {
                webgl_renderer = ReplaceAll(line,"WebglRenderer=","");
                webgl_renderer = ReplaceAll(webgl_renderer,"\"","");
            }
            if(line.find("WebglVendor=") != std::string::npos)
            {
                webgl_vendor = ReplaceAll(line,"WebglVendor=","");
                webgl_vendor = ReplaceAll(webgl_vendor,"\"","");
            }


            if(line.find("EnableFlash=true") != std::string::npos)
            {
                use_flash = true;
            }
            if(line.find("ProxiesReconnect=true") != std::string::npos)
            {
                proxies_reconnect = true;
            }
            if(line.find("AutostartDebug=true") != std::string::npos)
            {
                autostart_debug = true;
            }
            if(line.find("SkipFrames=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                skip_frames = std::stoi(s[1]);
                if(skip_frames < 1)
                    skip_frames = 1;
            }
            if(line.find("ToolboxHeight=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                toolbox_height = std::stoi(s[1]);
                if(toolbox_height < 100)
                    toolbox_height = 100;
            }
            if(line.find("MaxBrowserStartSimultaneously=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                max_browser_start_simultaneously = std::stoi(s[1]);
                if(max_browser_start_simultaneously < 1)
                    max_browser_start_simultaneously = 1;
            }
            if(line.find("MinFreeMemoryToStartBrowser=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                min_free_memory_to_start_browser = std::stoi(s[1]);
                if(min_free_memory_to_start_browser < 0)
                    min_free_memory_to_start_browser = 0;
            }

            if(line.find("MinUnusedCpu=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                min_unused_cpu = std::stoi(s[1]);
                if(min_unused_cpu < 0)
                    min_unused_cpu = 0;
            }
            if(line.find("ScenarioWidth=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                scenario_width = std::stoi(s[1]);
                if(scenario_width < 100)
                    scenario_width = 100;
            }
            if(line.find("Zoom=") != std::string::npos)
            {
                std::vector<std::string> s = split(line,'=');
                zoom = std::stoi(s[1]);
            }
            if(line.find("IsMaximized=true") != std::string::npos)
            {
                maximized = true;
            }
            if(line.find("Restart=false") != std::string::npos)
            {
                restart = false;
            }
            if(line.find("ProxyTunneling=false") != std::string::npos)
            {
                tunneling = false;
            }
            if(line.find("Detector=false") != std::string::npos)
            {
                detector = false;
            }
            if(line.find("UseHumanLikeMouseMoves=false") != std::string::npos)
            {
                emulate_mouse = false;
            }
            if(line.find("DisableWebgl=false") != std::string::npos)
            {
                webgl = "enable";
            }
            if(line.find("DisableWebgl=true") != std::string::npos)
            {
                webgl = "disable";
            }
            if(line.find("Languages=") != std::string::npos)
            {
                languages = ReplaceAll(line,"Languages=","");
                languages = ReplaceAll(languages,"\"","");
            }
            if(line.find("Modules=") != std::string::npos)
            {
                modules = ReplaceAll(line,"Modules=","");
                modules = ReplaceAll(modules,"\"","");
            }
        }
    }
    fin.close();
}

void settings::SetProfile(std::wstring profile)
{
    this->profile = profile;
    if(!IsAbsolutePath(this->profile))
    {
        this->profile = GetRelativePathToParentFolder(this->profile);
    }
}


void settings::ParseCommandLine(std::vector<std::wstring>& Params)
{
    std::vector<std::wstring> res;


    bool NextExtensions = false;
    bool NextUseFlash = false;
    bool NextSkipFrames = false;
    bool NextRefreshConnections = false;
    bool NextEncodeUtf8 = false;
    bool NextProfile = false;
    bool NextNoEmbeddedLanguages = false;
    bool NextProxyTunneling = false;
    for(std::wstring& param: Params)
    {
        if(NextUseFlash)
        {
            use_flash = param == L"1";
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextSkipFrames)
        {
            skip_frames = std::stoi(param);
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextRefreshConnections)
        {
            proxies_reconnect = param == L"1";
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextEncodeUtf8)
        {
            force_utf8 = param == L"1";
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextProfile)
        {
            SetProfile(param);
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextNoEmbeddedLanguages)
        {
            no_embedded = param == L"true";
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextProxyTunneling)
        {
            tunneling = param == L"1";
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }else if(NextExtensions)
        {
            extensions = split(param,L';');
            NextUseFlash = false;
            NextSkipFrames = false;
            NextRefreshConnections = false;
            NextEncodeUtf8 = false;
            NextProfile = false;
            NextNoEmbeddedLanguages = false;
            NextProxyTunneling = false;
            NextExtensions = false;
            continue;
        }

        if(param == L"--UseFlash")
        {
            NextUseFlash = true;
            continue;
        }else if(param == L"--SkipFrames")
        {
            NextSkipFrames = true;
            continue;
        }else if(param == L"--RefreshConnections")
        {
            NextRefreshConnections = true;
            continue;
        }else if(param == L"--EncodeUtf8")
        {
            NextEncodeUtf8 = true;
            continue;
        }else if(param == L"--Profile")
        {
            NextProfile = true;
            continue;
        }else if(param == L"--NoEmbeddedLanguages")
        {
            NextNoEmbeddedLanguages = true;
            continue;
        }else if(param == L"--ProxyTunneling")
        {
            NextProxyTunneling = true;
            continue;
        }else if(param == L"--Extensions")
        {
            NextExtensions = true;
            continue;
        }else if(starts_with(param, L"--unique-process-id="))
        {
            param.erase(0,20);
            unique_process_id = ws2s(param);
            continue;
        }


        res.push_back(param);
    }

    Params = res;
}

bool settings::ProxyTunneling()
{
    return tunneling;
}

bool settings::Detector()
{
    return detector;
}

bool settings::EmulateMouse()
{
    return emulate_mouse;
}

std::wstring settings::Profile()
{
    return profile;
}

std::vector<std::wstring> settings::Extensions()
{
    return extensions;
}

std::string settings::Languages()
{
    if(no_embedded)
    {
        return "";
    }
    return languages;
}

std::string settings::UniqueProcessId()
{
    return unique_process_id;
}

std::string settings::Modules()
{
    return modules;
}

std::string settings::Webgl()
{
    return webgl;
}

bool settings::UseFlash()
{
    return use_flash;
}

bool settings::ProxiesReconnect()
{
    return proxies_reconnect;
}

bool settings::AutostartDebug()
{
    return autostart_debug;
}


bool settings::ForceUtf8()
{
    return force_utf8;
}

int settings::SkipFrames()
{
    return skip_frames + 1;
}

void settings::SetProxiesReconnect(bool proxies_reconnect)
{
    this->proxies_reconnect = proxies_reconnect;
}
void settings::SetForceUtf8(bool force_utf8)
{
    this->force_utf8 = force_utf8;
}
void settings::SetSkipFrames(int skip_frames)
{
    if(skip_frames < 1)
        skip_frames = 1;
    this->skip_frames = skip_frames;
}

int settings::ToolboxHeight()
{
    return toolbox_height;
}

int settings::ScenarioWidth()
{
    return scenario_width;
}

void settings::SetToolboxHeight(int height)
{
    this->toolbox_height = height;
}

void settings::SetScenarioWidth(int width)
{
    this->scenario_width = width;
}

int settings::Zoom()
{
    return zoom;
}

bool settings::Maximized()
{
    return maximized;
}

bool settings::DebugToolbox()
{
    return debug_toolbox;
}

bool settings::DebugScenario()
{
    return debug_scenario;
}

void settings::SetMaximized(bool Maximized)
{
    maximized = Maximized;
    SaveToFile();
}

void settings::SaveToFile()
{
    try
    {
        std::ofstream outfile("settings_worker.ini");
        if(outfile.is_open())
        {
            outfile<<"EnableFlash="<<((use_flash) ? "true" : "false")<<std::endl;
            outfile<<"ProxiesReconnect="<<((proxies_reconnect) ? "true" : "false")<<std::endl;
            outfile<<"AutostartDebug="<<((autostart_debug) ? "true" : "false")<<std::endl;
            outfile<<"ForceUtf8="<<((force_utf8) ? "true" : "false")<<std::endl;
            outfile<<"SkipFrames="<<skip_frames<<std::endl;
            outfile<<"ToolboxHeight="<<toolbox_height<<std::endl;
            outfile<<"MaxBrowserStartSimultaneously="<<max_browser_start_simultaneously<<std::endl;
            outfile<<"MinFreeMemoryToStartBrowser="<<min_free_memory_to_start_browser<<std::endl;
            outfile<<"MinUnusedCpu="<<min_unused_cpu<<std::endl;
            outfile<<"ScenarioWidth="<<scenario_width<<std::endl;
            outfile<<"Zoom="<<zoom<<std::endl;
            outfile<<"IsMaximized="<<((maximized) ? "true" : "false")<<std::endl;
            outfile<<"Restart="<<((restart) ? "true" : "false")<<std::endl;
            outfile<<"UseHumanLikeMouseMoves="<<((emulate_mouse) ? "true" : "false")<<std::endl;
            outfile<<"DebugToolbox="<<((debug_toolbox) ? "true" : "false")<<std::endl;
            outfile<<"DebugScenario="<<((debug_scenario) ? "true" : "false")<<std::endl;
            outfile<<"Languages=\""<<languages<<"\""<<std::endl;
            outfile<<"Modules=\""<<modules<<"\""<<std::endl;

            outfile<<"Canvas=\""<<canvas<<"\""<<std::endl;
            outfile<<"CanvasNoise=\""<<canvas_noise<<"\""<<std::endl;
            outfile<<"Audio=\""<<audio<<"\""<<std::endl;
            outfile<<"AudioNoise=\""<<audio_noise<<"\""<<std::endl;
            outfile<<"Webrtc=\""<<webrtc<<"\""<<std::endl;
            outfile<<"WebrtcIps=\""<<webrtc_ips<<"\""<<std::endl;
            outfile<<"Webgl=\""<<webgl<<"\""<<std::endl;
            outfile<<"WebglNoise=\""<<webgl_noise<<"\""<<std::endl;
            outfile<<"WebglRenderer=\""<<webgl_renderer<<"\""<<std::endl;
            outfile<<"WebglVendor=\""<<webgl_vendor<<"\""<<std::endl;

            outfile<<"ProxyTunneling="<<((tunneling) ? "true" : "false")<<std::endl;
            outfile<<"Detector="<<((detector) ? "true" : "false")<<std::endl;
        }
    }catch(...)
    {
        WORKER_LOG("Failed to save settings_worker");
    }
}

std::string settings::Serialize()
{

    picojson::value::object res;
    res["use_flash"] = picojson::value(use_flash);
    res["proxies_reconnect"] = picojson::value(proxies_reconnect);
    res["autostart_debug"] = picojson::value(autostart_debug);
    res["force_utf8"] = picojson::value(force_utf8);
    res["canvas"] = picojson::value(canvas);
    res["canvas_noise"] = picojson::value(canvas_noise);
    res["audio"] = picojson::value(audio);
    res["audio_noise"] = picojson::value(audio_noise);
    res["webrtc"] = picojson::value(webrtc);
    res["webgl"] = picojson::value(webgl);
    res["webgl_noise"] = picojson::value(webgl_noise);
    res["webrtc_ips"] = picojson::value(webrtc_ips);
    res["webgl_renderer"] = picojson::value(webgl_renderer);
    res["webgl_vendor"] = picojson::value(webgl_vendor);
    res["skip_frames"] = picojson::value((double)skip_frames);
    res["toolbox_height"] = picojson::value((double)toolbox_height);
    res["max_browser_start_simultaneously"] = picojson::value((double)max_browser_start_simultaneously);
    res["min_free_memory_to_start_browser"] = picojson::value((double)min_free_memory_to_start_browser);
    res["min_unused_cpu"] = picojson::value((double)min_unused_cpu);
    res["scenario_width"] = picojson::value((double)scenario_width);
    res["zoom"] = picojson::value((double)zoom);
    res["restart"] = picojson::value(restart);
    res["emulatemouse"] = picojson::value(emulate_mouse);
    res["languages"] = picojson::value(languages);
    res["modules"] = picojson::value(modules);
    res["no_embedded"] = picojson::value((double)no_embedded);
    res["tunneling"] = picojson::value((double)tunneling);
    res["detector"] = picojson::value((double)detector);
    /*res["debug_toolbox"] = picojson::value(debug_toolbox);
    res["debug_scenario"] = picojson::value(debug_scenario);*/
    return picojson::value(res).serialize();
}

void settings::Deserialize(const std::string & Data)
{
    picojson::value val;
    try
    {
        picojson::parse(val, Data);
        picojson::value::object o = val.get<picojson::value::object>();

        use_flash = o["use_flash"].get<bool>();
        proxies_reconnect = o["proxies_reconnect"].get<bool>();
        autostart_debug = o["autostart_debug"].get<bool>();
        force_utf8 = o["force_utf8"].get<bool>();

        canvas = o["canvas"].get<std::string>();
        canvas_noise = o["canvas_noise"].get<std::string>();
        audio = o["audio"].get<std::string>();
        audio_noise = o["audio_noise"].get<std::string>();
        webrtc = o["webrtc"].get<std::string>();
        webgl = o["webgl"].get<std::string>();
        webgl_noise = o["webgl_noise"].get<std::string>();
        webrtc_ips = o["webrtc_ips"].get<std::string>();
        webgl_renderer = o["webgl_renderer"].get<std::string>();
        webgl_vendor = o["webgl_vendor"].get<std::string>();

        skip_frames = o["skip_frames"].get<double>();
        toolbox_height = o["toolbox_height"].get<double>();
        max_browser_start_simultaneously = o["max_browser_start_simultaneously"].get<double>();
        min_free_memory_to_start_browser = o["min_free_memory_to_start_browser"].get<double>();
        min_unused_cpu = o["min_unused_cpu"].get<double>();
        scenario_width = o["scenario_width"].get<double>();
        zoom = o["zoom"].get<double>();
        restart = o["restart"].get<bool>();
        emulate_mouse = o["emulatemouse"].get<bool>();
        languages = o["languages"].get<std::string>();
        modules = o["modules"].get<std::string>();
        tunneling = o["tunneling"].get<bool>();
        detector = o["detector"].get<bool>();

        /*debug_scenario = o["debug_scenario"].get<bool>();
        debug_toolbox = o["debug_toolbox"].get<bool>();*/

        if(toolbox_height < 100)
            toolbox_height = 100;

        if(scenario_width < 100)
            scenario_width = 100;

        if(skip_frames < 1)
            skip_frames = 1;



        SaveToFile();
    }catch(...)
    {

    }
}
