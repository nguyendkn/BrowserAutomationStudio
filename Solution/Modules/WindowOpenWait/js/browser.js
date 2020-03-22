;_BAS_HIDE(BrowserAutomationStudio_Open) = window.open;
window.open = function()
{
  _BAS_HIDE(BrowserAutomationStudio_Sleep)(100);
  return _BAS_HIDE(BrowserAutomationStudio_Open).apply(window,arguments);
};



