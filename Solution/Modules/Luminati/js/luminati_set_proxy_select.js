var Zone = GetInputConstructorValue("Zone", loader);
var Login = GetInputConstructorValue("Login", loader);
var PasswordValue = GetInputConstructorValue("Password", loader);
var Target = GetInputConstructorValue("Target", loader);
var Country = GetInputConstructorValue("Country", loader);
var City = GetInputConstructorValue("City", loader);
var ASN = GetInputConstructorValue("ASN", loader);
var Carrier = GetInputConstructorValue("Carrier", loader);
var IP = GetInputConstructorValue("IP", loader);
var gIP = GetInputConstructorValue("gIP", loader);
var Mobile = GetInputConstructorValue("Mobile", loader);
var DNS = GetInputConstructorValue("DNS", loader);



if(Zone["original"].length == 0)
{
  Invalid("Engine is empty");
  return;
}

if(Login["original"].length == 0)
{
  Invalid("Login is empty");
  return;
}

if(PasswordValue["original"].length == 0)
{
  Invalid("Password is empty");
  return;
}

if(Target["original"].length == 0)
{
  Invalid("Target is empty");
  return;
}

if(Mobile["original"].length == 0)
{
  Invalid("Mobile is empty");
  return;
}


var Zone = GetInputConstructorValue("Zone", loader);
var Login = GetInputConstructorValue("Login", loader);
var PasswordValue = GetInputConstructorValue("Password", loader);
var Target = GetInputConstructorValue("Target", loader);
var Country = GetInputConstructorValue("Country", loader);
var City = GetInputConstructorValue("City", loader);
var ASN = GetInputConstructorValue("ASN", loader);
var Carrier = GetInputConstructorValue("Carrier", loader);
var IP = GetInputConstructorValue("IP", loader);
var gIP = GetInputConstructorValue("gIP", loader);
var Mobile = GetInputConstructorValue("Mobile", loader);
var DNS = GetInputConstructorValue("DNS", loader);

 try{
  var code = loader.GetAdditionalData() + _.template($("#luminati_set_proxy_code").html())(
  	{
  		zone: Zone["updated"],
  		login: Login["updated"],
		password: PasswordValue["updated"],
		target: Target["updated"],
		country: Country["updated"],
		city: City["updated"],
		asn: ASN["updated"],
		carrier: Carrier["updated"],
		ip: IP["updated"],
		gip: gIP["updated"],
		mobile: Mobile["updated"],
		dns: DNS["updated"]
  	})
  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}