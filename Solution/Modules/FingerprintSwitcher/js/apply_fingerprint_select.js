var Fingerprint = GetInputConstructorValue("Fingerprint", loader);
var CanvasNoise = GetInputConstructorValue("CanvasNoise", loader);
var WebglNoise = GetInputConstructorValue("WebglNoise", loader);
var AudioNoise = GetInputConstructorValue("AudioNoise", loader);
var SafeBattery = GetInputConstructorValue("SafeBattery", loader);
var SafeRectangles = GetInputConstructorValue("SafeRectangles", loader);
var PerfectCanvas = GetInputConstructorValue("PerfectCanvas", loader);

if(Fingerprint["original"].length == 0)
{
  Invalid("Fingerprint is empty");
  return;
}

if(CanvasNoise["original"].length == 0)
{
  Invalid("CanvasNoise is empty");
  return;
}

if(PerfectCanvas["original"].length == 0)
{
  Invalid("PerfectCanvas is empty");
  return;
}

if(WebglNoise["original"].length == 0)
{
  Invalid("WebglNoise is empty");
  return;
}

if(AudioNoise["original"].length == 0)
{
  Invalid("AudioNoise is empty");
  return;
}

if(SafeBattery["original"].length == 0)
{
  Invalid("Battery is empty");
  return;
}

if(SafeRectangles["original"].length == 0)
{
  Invalid("Rectangles is empty");
  return;
}

try{
  var code = loader.GetAdditionalData() + _.template($("#apply_fingerprint_code").html())(
  	{
  		fingerprint: Fingerprint["updated"],
  		canvas: CanvasNoise["updated"],
  		webgl: WebglNoise["updated"],
      audio: AudioNoise["updated"],
      battery: SafeBattery["updated"],
      rectangles: SafeRectangles["updated"],
      perfectcanvas: PerfectCanvas["updated"]
  	})

  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}