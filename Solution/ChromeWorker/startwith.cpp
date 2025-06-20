#include "startwith.h"

bool starts_with(const string& s1, const string& s2)
{
    return s2.size() <= s1.size() && s1.compare(0, s2.size(), s2) == 0;
}

bool starts_with(const wstring& s1, const wstring& s2)
{
    return s2.size() <= s1.size() && s1.compare(0, s2.size(), s2) == 0;
}
