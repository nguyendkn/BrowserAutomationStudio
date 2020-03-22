#ifndef PREPARESTARTUPSCRIPT_H
#define PREPARESTARTUPSCRIPT_H

#include <string>
#include "browserdata.h"


std::string PrepareStartupScript(BrowserData* Data, const std::string Url, int TabId);

#endif // PREPARESTARTUPSCRIPT_H
