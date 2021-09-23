#ifndef BROWSERSETTINGSSAVER_H
#define BROWSERSETTINGSSAVER_H

#include <string>
#include <vector>

struct BrowserSettingsSaver
{
    //Setting to save files
    std::string FilePath;

    bool Detector;
    bool TemporaryDisableDetector;

    //Languages
    std::vector<std::string> Languages;
    std::string LanguagesHeader;
    std::string UserAgent;
    std::string UserAgentDataBase64;

    //Record mode
    bool IsRecord;

    double DeviceScaleFactor = 1.0;

    //Intercept showing menu from select html element
    bool SelectReplace = false;

    //Headers
    std::vector<std::pair<std::string, std::string> > Headers;

    void Save();
};

#endif // BROWSERSETTINGSSAVER_H
