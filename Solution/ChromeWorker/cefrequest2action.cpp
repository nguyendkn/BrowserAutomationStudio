#include "cefrequest2action.h"
#include "readallfile.h"
#include "picojson.h"
#include "log.h"
#include "base64.h"
#include "checkvalidutf8.h"
#include "multithreading.h"

std::string CefReqest2Action::JsonEscape(const std::string& Text)
{
    return picojson::value(Text).serialize();
}

std::string CefReqest2Action::JsonEscapeInsideString(const std::string & Text)
{
    std::string res = JsonEscape(Text);
    if(!res.empty())
    {
        res.erase(0,1);
    }
    if(!res.empty())
    {
        res.erase(res.length() - 1,1);
    }
    return res;
}


std::string CefReqest2Action::Convert(CefRefPtr<CefRequest> request)
{
    std::string Res;
    CefRefPtr<CefPostData> PostData = request->GetPostData();
    std::string Method = request->GetMethod().ToString();
    std::string Url = request->GetURL().ToString();
    std::string HeadersRaw;
    std::string ContentType;
    bool IsPost = false;
    std::vector<char> PostRawData;
    if(Method == "OPTIONS")
        return Res;


    /* Generate post data */
    if(PostData && PostData->GetElementCount() > 0)
    {
        IsPost = true;
        CefPostData::ElementVector Elements;
        PostData->GetElements(Elements);
        for(CefRefPtr<CefPostDataElement> Element:Elements)
        {
            if(Element->GetType() == PDE_TYPE_BYTES)
            {
                int Count = Element->GetBytesCount();
                std::vector<char> DataTemp;
                DataTemp.resize(Count);
                Element->GetBytes(Count,DataTemp.data());
                std::string Data(DataTemp.data(),Count);
                if(!utf8_check_is_valid(Data))
                {
                    Data = "BINARY DATA";
                }

                PostRawData.insert(PostRawData.end(), Data.begin(), Data.end());
            }
            if(Element->GetType() == PDE_TYPE_FILE)
            {
                std::string Data = ReadAllString(Element->GetFile().ToString());
                if(!utf8_check_is_valid(Data))
                {
                    Data = "BINARY DATA";
                }
                PostRawData.insert(PostRawData.end(), Data.begin(), Data.end());
            }
        }

        CefResponse::HeaderMap HeaderMap;
        request->GetHeaderMap(HeaderMap);
        for (std::multimap<CefString, CefString>::iterator it=HeaderMap.begin();it!=HeaderMap.end();it++)
        {
            std::string header = it->first.ToString();
            try{std::transform(header.begin(), header.end(), header.begin(), ::tolower);}catch(...){}
            if(header == "content-type")
            {
                ContentType = it->second.ToString();
                break;
            }

        }

    }

    /* Collect headers*/
    CefResponse::HeaderMap HeaderMap;
    request->GetHeaderMap(HeaderMap);
    if(!request->GetReferrerURL().ToString().empty())
        HeaderMap.insert(std::pair<std::string,std::string>("Referer",request->GetReferrerURL()));
    for (std::multimap<CefString, CefString>::iterator it=HeaderMap.begin();it!=HeaderMap.end();it++)
    {
        std::string key = it->first.ToString();
        std::string value = it->second.ToString();

        if(key == std::string("Accept-Encoding"))
        {
            value = "gzip, deflate";
        }
        if(key == std::string("Connection"))
        {
            continue;
        }
        if(key == std::string("Host"))
        {
            continue;
        }
        if(key == std::string("Content-Type"))
        {
            continue;
        }

        if(!HeadersRaw.empty())
            HeadersRaw += std::string("\n");
        HeadersRaw += key;
        HeadersRaw += std::string(": ");
        HeadersRaw += value;

    }




    if(IsPost)
    {
        /* Adding post action */
        std::string PostDataString(PostRawData.data(),PostRawData.size());
        std::string code = std::string("\n_switch_http_client_main()\n") +
        std::string("http_client_post_no_redirect(") + JsonEscape(Url) + std::string(", [\"data\", ") + JsonEscape(PostDataString)
                + std::string("],{method:(") + JsonEscape(Method)
                + std::string("), encoding:\"UTF-8\", \"content-type\":(") + JsonEscape(std::string("custom/") + ContentType)
                + std::string("), headers:(") + JsonEscape(HeadersRaw)
                + std::string(")})!");
        std::string json =
                std::string("{\"s\":\"httpclientpost\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\""
                            ",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Value\",\"type\":\"constr\""
                            ",\"data\":") + JsonEscape(Url) + std::string(",\"class\":\"string\"},"
                            "{\"id\":\"Check2\",\"type\":\"check\",\"data\":false},{\"id\":\"PostName\""
                            ",\"type\":\"constr\",\"data\":\"\",\"class\":\"string\"},{\"id\":\"PostValue\""
                            ",\"type\":\"constr\",\"data\":\"\",\"class\":\"string\"},{\"id\":\"PostDataArray\""
                            ",\"type\":\"constr\",\"data\":\"\",\"class\":\"expression\"},{\"id\":\"ContentType\""
                            ",\"type\":\"constr\",\"data\":\"urlencode\",\"class\":\"string\"}"
                            ",{\"id\":\"PostDataRaw\",\"type\":\"constr\",\"data\":") + JsonEscape(PostDataString)
                            + std::string(",\"class\":\"string\"},{\"id\":\"ContentTypeRaw\",\"type\""
                            ":\"constr\",\"data\":") + JsonEscape(ContentType) + std::string(",\"class\":\"string\"}"
                            ",{\"id\":\"Encoding\",\"type\":\"constr\",\"data\":\"UTF-8\",\"class\":\"string\"}"
                            ",{\"id\":\"Method\",\"type\":\"constr\",\"data\":") + JsonEscape(Method)
                            + std::string(",\"class\":\"string\"},{\"id\":\"Check\",\"type\":\"check\",\"data\":false},"
                            "{\"id\":\"Headers\",\"type\":\"constr\",\"data\":") + JsonEscape(HeadersRaw)   + std::string(",\"class\":\"string\"}]}");


        std::string base64_json = base64_encode((unsigned char const *)json.data(),json.size());

        std::string task = std::string("BrowserAutomationStudio_AddTask(\"\",\"\\/*Dat:") + base64_json + std::string("*\\/") + JsonEscapeInsideString(code) + std::string("\",0, true);");

        WORKER_LOG(std::string("AddNewTask<<") + task);
        Res+=std::string(";");
        Res+=task;
    }else
    {
        /* Adding get action */
        std::string code = std::string("\n_switch_http_client_main()\n") +
        std::string("http_client_get_no_redirect2(") + JsonEscape(Url) + std::string(",{method:(") + JsonEscape(Method) + std::string("), headers:(") + JsonEscape(HeadersRaw) + std::string(")})!");
        std::string json =
                std::string("{\"s\":\"httpclientget\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Value\",\"type\":\"constr\",\"data\":")
                + JsonEscape(Url) + std::string(",\"class\":\"string\"},{\"id\":\"Method\",\"type\":\"constr\",\"data\":") + JsonEscape(Method) + std::string(",\"class\":\"string\"},{\"id\":\"Check\",\"type\":\"check\",\"data\":false},"
                "{\"id\":\"Headers\",\"type\":\"constr\",\"data\":") + JsonEscape(HeadersRaw)   + std::string(",\"class\":\"string\"}]}");


        std::string base64_json = base64_encode((unsigned char const *)json.data(),json.size());

        std::string task = std::string("BrowserAutomationStudio_AddTask(\"\",\"\\/*Dat:") + base64_json + std::string("*\\/") + JsonEscapeInsideString(code) + std::string("\",0,true);");

        WORKER_LOG(std::string("AddNewTask<<") + task);
        Res+=std::string(";");
        Res+=task;

    }


    return Res;
}

void CefReqest2Action::Reset()
{

}
