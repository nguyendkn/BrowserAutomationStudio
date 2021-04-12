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
    std::string UserAgent;

    //Record mode
    bool IsRecord;

    //Headers
    std::vector<std::pair<std::string, std::string> > Headers;

    void Save();
};

#endif // BROWSERSETTINGSSAVER_H
