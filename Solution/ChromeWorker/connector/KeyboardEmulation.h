#ifndef KEYBOARDEMULATION_H
#define KEYBOARDEMULATION_H

#include "Variant.h"
#include "InputEventsEnumerations.h"

class KeyboardEmulation
{
	int GetNativeCode(int key);
	std::string GetDOMCode(int Key);
	public:
		std::map<std::string, Variant> PrepareKeyboardEvent(KeyEvent Event, const std::string& Char, int KeyboardPresses);
};

#endif // KEYBOARDEMULATION_H