#ifndef FONTREPLACE_H
#define FONTREPLACE_H

#include <vector>
#include <string>
#include <map>

class FontReplace
{
    private:
        bool IsHookInstalled = false;
        bool IsFontsInstalled = false;
        bool IsFontsCollectedSystem = false;
        bool IsFontsCollectedAdditional = false;
        std::vector<std::wstring> fonts;
        std::map<std::wstring,std::wstring> font_path;

    public:
        static FontReplace& GetInstance()
        {
            static FontReplace instance;
            return instance;
        }
    private:
        FontReplace(){}
        FontReplace(FontReplace const&);
        void operator=(FontReplace const&);
        void CollectFonts();
    public:
        bool Initialize();
        bool Hook();
        bool Uninitialize();
        bool UnHook();

        void SetFonts(const std::string& fonts);

        std::wstring ConvertFontFileToFontName(const std::wstring& FontFile);
        bool IsStandartFont(const std::wstring& font);
        bool NeedDisplayFont(const std::wstring& font);



};

#endif // FONTREPLACE_H
