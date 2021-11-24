#ifndef CLIPBOARD_H
#define CLIPBOARD_H

#include <string>
#include "startwith.h"

std::string read_clipboard();
void write_clipboard(const std::string data, bool use_prefix = true);


#endif // CLIPBOARD_H
