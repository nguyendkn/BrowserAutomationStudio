#ifndef DETECTORV8HANDLER_H
#define DETECTORV8HANDLER_H


#include "include/cef_app.h"
#include <functional>
#include <mutex>

class DetectorV8Handler : public CefBaseRefCounted
{
    public:
        struct SourceItem
        {
            std::string Source;
            int LineNumber;
            int ColumnNumber;
        };

private:

    std::string url;
    bool url_changed;

    SourceItem source;
    bool source_changed;

    std::string edit_source;
    bool edit_source_changed;

    std::string fingerprint_key;
    bool fingerprint_key_changed;

    bool clear_all;
    bool logout;

    bool is_initialized;

public:
    DetectorV8Handler();
    bool Execute(const CefString& name, CefRefPtr<CefListValue> arguments);
    std::pair<std::string, bool> GetLoadUrl();

    std::pair<SourceItem, bool> GetSource();
    std::pair<std::string, bool> GetFingerprintKey();
    std::pair<std::string, bool> GetEditSource();
    bool GetClearAll();
    bool GetLogout();
    bool GetIsInitialized();
private:
    IMPLEMENT_REFCOUNTING(DetectorV8Handler);
};

#endif // DETECTORV8HANDLER_H
