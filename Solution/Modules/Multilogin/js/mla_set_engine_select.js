var Value = GetInputConstructorValue("Value", loader);
var DisablePlugins = GetInputConstructorValue("DisablePlugins", loader);
var DisableFlashPlugins = GetInputConstructorValue("DisableFlashPlugins", loader);
var Extensions = GetInputConstructorValue("Extensions", loader);
var CanvasDefType = GetInputConstructorValue("CanvasDefType", loader);
var MaskFonts = GetInputConstructorValue("MaskFonts", loader);
var Platform = GetInputConstructorValue("Platform", loader);
var DoNotTrack = GetInputConstructorValue("DoNotTrack", loader);
var HardwareConcurrency = GetInputConstructorValue("HardwareConcurrency", loader);
var AppVersion = GetInputConstructorValue("AppVersion", loader);
var BuildID = GetInputConstructorValue("BuildID", loader);
var AudioNoise = GetInputConstructorValue("AudioNoise", loader);
var Dns = GetInputConstructorValue("Dns", loader);
var MediaDevicesAudioInputs = GetInputConstructorValue("MediaDevicesAudioInputs", loader);
var MediaDevicesAudioOutputs = GetInputConstructorValue("MediaDevicesAudioOutputs", loader);
var MediaDevicesVideoInputs = GetInputConstructorValue("MediaDevicesVideoInputs", loader);
var WebglNoise = GetInputConstructorValue("WebglNoise", loader);
var WebglVendor = GetInputConstructorValue("WebglVendor", loader);
var WebglRenderer = GetInputConstructorValue("WebglRenderer", loader);
var Webrtc = GetInputConstructorValue("Webrtc", loader);
var WebrtcPublicIp = GetInputConstructorValue("WebrtcPublicIp", loader);
var WebrtcLocalIps = GetInputConstructorValue("WebrtcLocalIps", loader);



if(Value["original"].length == 0)
{
  Invalid("Engine is empty");
  return;
}


 try{
  var code = loader.GetAdditionalData() + _.template($("#mla_set_engine_code").html())(
  	{
  		value: Value["updated"],
  		DisablePlugins: DisablePlugins["updated"],
		DisableFlashPlugins: DisableFlashPlugins["updated"],
		Extensions: Extensions["updated"],
		CanvasDefType: CanvasDefType["updated"],
		MaskFonts: MaskFonts["updated"],
		Platform: Platform["updated"],
		DoNotTrack: DoNotTrack["updated"],
		HardwareConcurrency: HardwareConcurrency["updated"],
		AppVersion: AppVersion["updated"],
		BuildID: BuildID["updated"],
		AudioNoise: AudioNoise["updated"],
		Dns: Dns["updated"],
		MediaDevicesAudioInputs: MediaDevicesAudioInputs["updated"],
		MediaDevicesAudioOutputs: MediaDevicesAudioOutputs["updated"],
		MediaDevicesVideoInputs: MediaDevicesVideoInputs["updated"],
		WebglNoise: WebglNoise["updated"],
		WebglVendor: WebglVendor["updated"],
		WebglRenderer: WebglRenderer["updated"],
		Webrtc: Webrtc["updated"],
		WebrtcPublicIp: WebrtcPublicIp["updated"],
		WebrtcLocalIps: WebrtcLocalIps["updated"]
  	})
  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}