_ARG = "lum-customer-" + (<%= login %>) + "-zone-" + (<%= zone %>)
if(<%= country %>.length > 0)
     _ARG += "-country-" + (<%= country %>)

if(<%= city %>.length > 0)
     _ARG += "-city-" + (<%= city %>)

if(<%= asn %>.length > 0)
     _ARG += "-asn-" + (<%= asn %>)

if(<%= carrier %>.length > 0)
     _ARG += "-carrier-" + (<%= carrier %>)

if(<%= ip %>.length > 0)
     _ARG += "-ip-" + (<%= ip %>)

if(<%= gip %>.length > 0)
     _ARG += "-gip-" + (<%= gip %>)

if(<%= mobile %>.length > 0 && (<%= mobile %>) != "false")
     _ARG += "-mobile-" + (<%= mobile %>)

_ARG += "-dns-" + (<%= dns %>)

_ARG += "-session-" + rand(4)


_if_else((<%= target %>) == "Browser", function(){
     set_proxy("zproxy.lum-superproxy.io", 22225, true, _ARG, <%= password %>)!
}, function(){
   http_client_set_proxy("zproxy.lum-superproxy.io", 22225, true, _ARG, <%= password %>)
})!
