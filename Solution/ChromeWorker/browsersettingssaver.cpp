#include "browsersettingssaver.h"
#include <fstream>
#include "picojson.h"
#include "replaceall.h"

void BrowserSettingsSaver::Save()
{
    try
    {
        std::ofstream outfile(FilePath);
        if(outfile.is_open())
        {
            std::string Language;
            if(!Languages.empty())
                Language = Languages[0];
            std::string LanguagesJsonString;

            picojson::value::array res;
            for (const std::string& Lang: Languages)
            {
                res.push_back(picojson::value(Lang));
            }

            LanguagesJsonString = picojson::value(res).serialize();

            outfile<<"Attribute.language="<<Language<<std::endl;
            outfile<<"Attribute.languages="<<LanguagesJsonString<<std::endl;
            if(!UserAgent.empty())
            {
                outfile<<"Attribute.userAgent="<<UserAgent<<std::endl;
                outfile<<"Attribute.vendor="<<""<<std::endl;
                outfile<<"Attribute.platform="<<""<<std::endl;
                outfile<<"Attribute.appVersion="<<ReplaceAll(UserAgent, "Mozilla/", "")<<std::endl;
            }


            outfile<<"FingerprintDetectorEnabled="<<((IsRecord && Detector && !TemporaryDisableDetector) ? "true" : "false")<<std::endl;

            outfile<<"LocaleName="<<Language<<std::endl;

        }
        outfile.close();
    }catch(...)
    {

    }
}
