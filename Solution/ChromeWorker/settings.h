#ifndef SETTINGS_H
#define SETTINGS_H

#include <string>
#include <vector>

class settings
{
    bool use_flash;
    bool use_widevine;
    bool force_utf8;
    int toolbox_height;
    int scenario_width;
    int max_browser_start_simultaneously;
    int min_free_memory_to_start_browser;
    int min_unused_cpu;
    std::string canvas;
    std::string canvas_noise;
    std::string audio;
    std::string audio_noise;
    std::string webrtc;
    std::string webrtc_ips;
    std::string webgl;
    std::string webgl_noise;
    std::string webgl_renderer;
    std::string webgl_vendor;

    int zoom;
    bool maximized;
    bool restart;
    bool emulate_mouse;
    bool autostart_debug;
    bool debug_toolbox;
    bool debug_scenario;
    bool no_embedded;
    bool detector;
    std::string unique_process_id;
    std::wstring profile;
    std::vector<std::wstring> extensions;
    std::string languages;
    std::string modules;
    void SetProfile(std::wstring profile);
public:
    settings();
    bool UseFlash();
    bool UseWidevine();
    bool AutostartDebug();
    bool Maximized();
    bool DebugToolbox();
    bool DebugScenario();
    bool EmulateMouse();
    bool Detector();
    std::wstring Profile();
    std::vector<std::wstring> Extensions();
    std::string Languages();
    std::string UniqueProcessId();
    std::string Modules();
    std::string Webgl();
    void SetMaximized(bool Maximized);
    int ToolboxHeight();
    int ScenarioWidth();
    int Zoom();

    void SetToolboxHeight(int height);
    void SetScenarioWidth(int width);

    void SaveToFile();
    std::string Serialize();
    void Deserialize(const std::string & Data);
    void ParseCommandLine(std::vector<std::wstring>& Params);
    void Init();
};

#endif // SETTINGS_H
