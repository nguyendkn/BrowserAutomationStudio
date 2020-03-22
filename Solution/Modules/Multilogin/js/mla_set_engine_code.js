var Params = {"BrowserEngine":(<%= value %>)}

if(<%= DisablePlugins %>.length > 0)
{
	Params["multilogin.fingerprintGeneration.disablePlugins"] = JSON.stringify(<%= DisablePlugins %> == "true")
}

if(<%= DisableFlashPlugins %>.length > 0)                                                                       
{                                                                                                               
     Params["multilogin.fingerprintGeneration.disableFlashPlugin"] = JSON.stringify(<%= DisableFlashPlugins %> == "true")                              
}            

if(<%= Extensions %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.customExtensionFileNames"] = JSON.stringify(<%= Extensions %>.match(/[^\r\n]+/g).join(";"))                                                
}                                                                                                               
if(<%= CanvasDefType %>.length > 0)                                                                             
{                                                                                                               
     Params["multilogin.fingerprintGeneration.canvasDefType"] = JSON.stringify(<%= CanvasDefType %>)                                          
}                                                                                                               
if(<%= MaskFonts %>.length > 0)                                                                                 
{                                                                                                               
     Params["multilogin.fingerprintGeneration.maskFonts"] = JSON.stringify(<%= MaskFonts %> == "true")                                                  
}                                                                                                               
if(<%= Platform %>.length > 0)                                                                                  
{                                                                                                               
     Params["multilogin.fingerprintGeneration.platform"] = JSON.stringify(<%= Platform %>)                                                    
}                                                                                                               
if(<%= DoNotTrack %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.doNotTrack"] = JSON.stringify(<%= DoNotTrack %>)                                                
}                                                                                                               
if(<%= HardwareConcurrency %>.length > 0)                                                                       
{                                                                                                               
     Params["multilogin.fingerprintGeneration.hardwareConcurrency"] = JSON.stringify(parseInt(<%= HardwareConcurrency %>))
}                                                                                                               
if(<%= AppVersion %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.appVersion"] = JSON.stringify(<%= AppVersion %>)                                                
}                                                                                                               
if(<%= BuildID %>.length > 0)                                                                                   
{                                                                                                               
     Params["multilogin.fingerprintGeneration.buildID"] = JSON.stringify(<%= BuildID %>)                                                      
}                                                                                                               
if(<%= AudioNoise %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.audio.noise"] = JSON.stringify(<%= AudioNoise %>)                                                
}                                                                                                               
if(<%= Dns %>.length > 0)                                                                                       
{                                                                                                               
     Params["multilogin.fingerprintGeneration.dns"] = JSON.stringify(<%= Dns %>.match(/[^\r\n]+/g))                                                              
}                                                                                                               
if(<%= MediaDevicesAudioInputs %>.length > 0)                                                                   
{                                                                                                               
     Params["multilogin.fingerprintGeneration.mediaDevices.audioInputs"] = JSON.stringify(parseInt(<%= MediaDevicesAudioInputs %>))                      
}                                                                                                               
if(<%= MediaDevicesAudioOutputs %>.length > 0)                                                                  
{                                                                                                               
     Params["multilogin.fingerprintGeneration.mediaDevices.audioOutputs"] = JSON.stringify(parseInt(<%= MediaDevicesAudioOutputs %>))                    
}                                                                                                               
if(<%= MediaDevicesVideoInputs %>.length > 0)                                                                   
{                                                                                                               
     Params["multilogin.fingerprintGeneration.mediaDevices.videoInputs"] = JSON.stringify(parseInt(<%= MediaDevicesVideoInputs %>))                      
}                                                                                                               
if(<%= WebglNoise %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webgl.noise"] = JSON.stringify(<%= WebglNoise %> == "true")                                                
}                                                                                                               
if(<%= WebglVendor %>.length > 0)                                                                               
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webgl.vendor"] = JSON.stringify(<%= WebglVendor %>)                                              
}                                                                                                               
if(<%= WebglRenderer %>.length > 0)                                                                             
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webgl.renderer"] = JSON.stringify(<%= WebglRenderer %>)                                          
}                                                                                                               
if(<%= Webrtc %>.length > 0)                                                                                
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webRtc.type"] = JSON.stringify(<%= Webrtc %>)
     Params["multilogin.fingerprintGeneration.webRtc.fillOnStart"] = "true" 
}                                                                                                               
if(<%= WebrtcPublicIp %>.length > 0)                                                                            
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webRtc.publicIp"] = JSON.stringify(<%= WebrtcPublicIp %>)                                        
}                                                                                                               
if(<%= WebrtcLocalIps %>.length > 0)                                                                            
{                                                                                                               
     Params["multilogin.fingerprintGeneration.webRtc.localIps"] = JSON.stringify(<%= WebrtcLocalIps %>.match(/[^\r\n]+/g))                                        
}

Params["multilogin.fingerprintGeneration.geolocation.permitType"] = "\"ALWAYS\""

_settings(Params)!

