#include "popupemulation.h"
#include "JsonParser.h"
#include "JsonSerializer.h"
#include "converter.h"

void PopupEmulation::Init(BrowserData *Data, int FirstIndex, HWND hwnd)
{
    this->Data = Data;
    this->hwnd = hwnd;
    this->FirstIndex = FirstIndex;
    SelectElementIPC.Init(std::string("inselect") + Data->_UniqueProcessId);
}

void PopupEmulation::CloseMenu()
{
    if(hMenu)
    {
        DestroyMenu(hMenu);
        hMenu = 0;
    }
}

void PopupEmulation::ShowMenu(int X, int Y, std::vector<std::string> Options)
{
    CloseMenu();

    hMenu = CreatePopupMenu();

    int i = 0;
    for(std::string Option: Options)
    {
        AppendMenu(hMenu, MF_BYPOSITION | MF_STRING, FirstIndex + i, s2ws(Option).c_str());
        i++;
    }

    POINT p;
    p.x = 0;
    p.y = 0;

    GetCursorPos(&p);

    int Result = TrackPopupMenu(hMenu, TPM_TOPALIGN | TPM_LEFTALIGN | TPM_RETURNCMD, p.x, p.y, 0, hwnd, NULL) - FirstIndex;

    if(Result < 0)
        Result = -1;

    CloseMenu();

    if(CurrentElementId.empty())
    {
        return;
    }

    JsonSerializer Serializer;
    std::map<std::string, Variant> SendObject;
    SendObject["type"] = Variant(std::string("popup_result"));
    SendObject["index"] = Variant(Result);
    SendObject["element_id"] = Variant(CurrentElementId);
    std::string SendData = Serializer.SerializeObjectToString(SendObject);

    IPCSimple::Write(std::string("outselect") + CurrentElementId + Data->_UniqueProcessId, SendData);

}

void PopupEmulation::Timer()
{
    /*if(hMenu && Data->ManualControl == BrowserData::Indirect)
    {
        CloseMenu();
    }*/

    if(SelectElementIPC.Peek())
    {
        std::vector<std::string> DataAll = SelectElementIPC.Read();

        for(std::string& CurrentData:DataAll)
        {
            JsonParser Parser;
            if(Parser.GetStringFromJson(CurrentData,"type") == std::string("open_popup"))
            {
                for(auto f:EventPopupShown)
                    f();

                if(Data->ManualControl == BrowserData::Indirect)
                    return;

                int X = Parser.GetFloatFromJson(CurrentData,"left");
                int Y = Parser.GetFloatFromJson(CurrentData,"top") + Parser.GetFloatFromJson(CurrentData,"width");

                std::vector<std::string> Options;

                picojson::value OptionsValue;
                bool ParsedCorrectly = true;
                try
                {
                    picojson::parse(OptionsValue, CurrentData);
                }
                catch (...)
                {
                    ParsedCorrectly = false;
                }
                if(ParsedCorrectly && OptionsValue.is<picojson::object>())
                {
                    picojson::object OptionsObject = OptionsValue.get<picojson::object>();
                    if(OptionsObject.count("options") > 0 && OptionsObject["options"].is<picojson::array>())
                    {
                        picojson::array OptionsArray = OptionsObject["options"].get<picojson::array>();

                        for(picojson::value& OptionValue: OptionsArray)
                        {
                            if(OptionValue.is<std::string>())
                            {
                                std::string Option = OptionValue.get<std::string>();

                                Options.push_back(Option);
                            }
                        }
                    }
                }


                if(Options.empty())
                    return;

                CurrentElementId = Parser.GetStringFromJson(CurrentData,"element_id");
                ShowMenu(X, Y, Options);
                return;
            }
        }
    }
}
