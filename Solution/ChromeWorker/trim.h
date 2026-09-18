#pragma once
#include <algorithm>
#include <functional>
#include <cctype>
#include <locale>
#include <string>
std::string &ltrim(std::string &s);
std::string &rtrim(std::string &s);
std::string &trim(std::string &s);
inline std::string trim_copy(const std::string &s){ std::string t=s; ltrim(rtrim(t)); return t; }
std::string trim(const std::string &s_);
