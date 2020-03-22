;window.Notification = function(title, data) {
    this.title = title
    this.body = ""
    this.data = null
    this.dir = "auto"
    this.lang = ""
    this.tag = ""
    this.icon = ""
    if (data)
        Object.assign(this, data);
    var self = this
    setTimeout(function() {
        if(self.onshow)
            self.onshow()

        if(self.onclose)
            setTimeout(function() {
                self.onclose()
            },2000)
            
    }, 10)
};

Object.defineProperty(window.Notification, "toString", {
    configurable: false,
    enumerable: false,
    value: function()
    {
        return "function Notification() { [native code] }"
    }
});

Object.defineProperty(window.Notification, "maxActions", {
    configurable: false,
    enumerable: true,
    value: 2
});
Object.defineProperty(chrome, "app", {
    configurable: false,
    enumerable: true,
    value: 
    {
        isInstalled: false,
        InstallState: {DISABLED: "disabled", INSTALLED: "installed", NOT_INSTALLED: "not_installed"},
        RunningState: {CANNOT_RUN: "cannot_run", READY_TO_RUN: "ready_to_run", RUNNING: "running"},
        getDetails: ((function(){
            var res = function(){return null}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function getDetails() { [native code] }"
                }
            });
            return res;
        })()),
        getIsInstalled: ((function(){
            var res = function(){return false}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function getIsInstalled() { [native code] }"
                }
            });
            return res;
        })()),
        installState: ((function(){
            var res = function(){}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function installState() { [native code] }"
                }
            });
            return res;
        })()),
        runningState: ((function(){
            var res = function(){return "cannot_run"}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function runningState() { [native code] }"
                }
            });
            return res;
        })())
    }
});


Object.defineProperty(chrome, "runtime", {
    configurable: false,
    enumerable: true,
    value: 
    {
        id: undefined,
        OnInstalledReason: {CHROME_UPDATE: "chrome_update", INSTALL: "install", SHARED_MODULE_UPDATE: "shared_module_update", UPDATE: "update"},
        OnRestartRequiredReason: {APP_UPDATE: "app_update", OS_UPDATE: "os_update", PERIODIC: "periodic"},
        PlatformArch: {ARM: "arm", MIPS: "mips", MIPS64: "mips64", X86_32: "x86-32", X86_64: "x86-64"},
        PlatformNaclArch: {ARM: "arm", MIPS: "mips", MIPS64: "mips64", X86_32: "x86-32", X86_64: "x86-64"},
        PlatformOs: {ANDROID: "android", CROS: "cros", LINUX: "linux", MAC: "mac", OPENBSD: "openbsd", WIN: "win"},
        RequestUpdateCheckStatus: {NO_UPDATE: "no_update", THROTTLED: "throttled", UPDATE_AVAILABLE: "update_available"},
        InstallState: {DISABLED: "disabled", INSTALLED: "installed", NOT_INSTALLED: "not_installed"},
        RunningState: {CANNOT_RUN: "cannot_run", READY_TO_RUN: "ready_to_run", RUNNING: "running"},
        sendMessage: ((function(){
            var res = function(){return undefined}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function sendMessage() { [native code] }"
                }
            });
            return res;
        })()),
        connect: ((function(){
            var res = function(){return undefined}
            Object.defineProperty(res, "toString", {
                configurable: false,
                enumerable: false,
                value: function()
                {
                    return "function connect() { [native code] }"
                }
            });
            return res;
        })())
    }
});


try{
	ServiceWorkerRegistration.prototype.showNotification = function(){}
}catch(e){}

window.Notification.requestPermission = function() {
	
    var Arguments = arguments
    if (arguments.length == 0) {
        return new Promise(function(resolve, reject) {
        	_BAS_HIDE(BrowserAutomationStudio_ReqestNotification)();
            setTimeout(function() {
                resolve(window.Notification.permission)
            }, 3000);
        })
    } else {
    	_BAS_HIDE(BrowserAutomationStudio_ReqestNotification)();
        setTimeout(function() {
            Arguments[0](window.Notification.permission);
        }, 3000)
    }
	
};