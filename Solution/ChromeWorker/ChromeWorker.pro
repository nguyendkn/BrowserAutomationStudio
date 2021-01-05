TEMPLATE = app
CONFIG += windows
CONFIG -= app_bundle
CONFIG -= qt

DEFINES+=CURL_STATICLIB

DEFINES+=NOT_BAS_DEBUG

QMAKE_LFLAGS += /LARGEADDRESSAWARE

SOURCES += main.cpp \
    browsercontextmenu.cpp \
    connector/ActionSaver.cpp \
    connector/DevToolsActionCloseTab.cpp \
    connector/DevToolsActionCreateTab.cpp \
    connector/DevToolsActionGetCurrentUrl.cpp \
    connector/DevToolsActionNavigateBack.cpp \
    connector/DevToolsActionRequestDeny.cpp \
    connector/DevToolsActionSetProxy.cpp \
    connector/DevToolsActionStartScreenCast.cpp \
    connector/DevToolsActionStopScreenCast.cpp \
    connector/DevToolsActionSwitchToTab.cpp \
    connector/DevToolsGlobalState.cpp \
    connector/DevToolsMultiAction.cpp \
    connector/InputEventsEnumerations.cpp \
    connector/JsonParser.cpp \
    connector/JsonSerializer.cpp \
    connector/KeyboardEmulation.cpp \
    connector/PrepareUrl.cpp \
    connector/asyncresult.cpp \
    connector/devtoolsactionexecutejavascript.cpp \
    connector/devtoolsactionfactory.cpp \
    connector/devtoolsactiongetbrowsersize.cpp \
    connector/devtoolsactiongettabs.cpp \
    connector/devtoolsactionload.cpp \
    connector/devtoolsactionresizebrowser.cpp \
    connector/devtoolsactionsetstartupscript.cpp \
    connector/devtoolsactionwebsocketquery.cpp \
    connector/devtoolsconnector.cpp \
    connector/idevtoolsaction.cpp \
    connector/rawcpphttpclient.cpp \
    connector/rawcpphttpclientfactory.cpp \
    connector/rawcppwebsocketclient.cpp \
    connector/rawcppwebsocketclientfactory.cpp \
    donothingcallback.cpp \
    emptyrequestcontexthandler.cpp \
    fileexists.cpp \
    fileutils.cpp \
    ipcsimple.cpp \
    mainapp.cpp \
    mainhandler.cpp \
    newtabschemehandlerfactory.cpp \
    notificationmanager.cpp \
    pipesclient.cpp \
    log.cpp \
    commandparser.cpp \
    prepareurladressbar.cpp \
    proxydata.cpp \
    resultmanager.cpp \
    xml_encoder.cpp \
    devtoolshandler.cpp \
    cookievisitor.cpp \
    converter.cpp \
    match.cpp \
    base64.cpp \
    browserdata.cpp \
    v8handler.cpp \
    javascriptextensions.cpp \
    elementcommand.cpp \
    browsereventsemulator.cpp \
    toolboxhandler.cpp \
    mainlayout.cpp \
    scenariohandler.cpp \
    toolboxv8handler.cpp \
    scenariov8handler.cpp \
    inspectresult.cpp \
    variablesextractor.cpp \
    extract_functions.cpp \
    png/lodepng.cpp \
    settings.cpp \
    translate.cpp \
    curlresourcehandler.cpp \
    trim.cpp \
    split.cpp \
    readallfile.cpp \
    multithreading.cpp \
    modulesdata.cpp \
    toolboxpreprocessor.cpp \
    replaceall.cpp \
    convertencoding.cpp \
    extract_resources.cpp \
	handlersmanager.cpp \
    centralhandler.cpp \
    centralv8handler.cpp \
    clipboard.cpp \
    startwith.cpp \
    processlocation.cpp \
    urlnormalize.cpp \
    chromecommandlineparser.cpp \
    randomid.cpp \
    CrashHandler.cpp \
    localstoragedata.cpp \
    fixpagecontent.cpp \
    snappy/snappy.cc \
    snappy/snappy-c.cc \
    snappy/snappy-sinksource.cc \
    snappy/snappy-stubs-internal.cc \
    extract_labels.cpp \
    postmanager.cpp \
    highlightresult.cpp \
    imagefinder.cpp \
    writefile.cpp \
    aes.cpp \
    md5.cpp \
    requestlist.cpp \
    resourcehandler.cpp \
    urlrequestclient.cpp \
    cefrequest2action.cpp \
    tooltip/gToolTip.cpp \
    checkvalidutf8.cpp \
    fillalpharectangle.cpp \
    generatejsonmenu.cpp \
    sharedmemoryipc.cpp \
    emptyapp.cpp \
    renderapp.cpp \
    preparestartupscript.cpp \
    interprocessv8handler.cpp \
    browserip.cpp \
    languagemanager.cpp \
    browsersettingssaver.cpp \
    detectorhandler.cpp \
    fingerprintdetector.cpp \
    detectorv8handler.cpp \
    browserdirectcontrol.cpp \
    popup.cpp

INCLUDEPATH += $(BAS_PATH_WORKER)/include


LIBS += -L$(BAS_PATH_WORKER)/lib -llibiconv -llibcef -llibcef_dll_wrapper -lAdvapi32 -luser32 -lPsapi -lshell32 -lDbgHelp -lComdlg32 -lgdi32 -llibcurl -llibeay32 -lssleay32 -lnetwork-uri
win32:LIBS += -lMsimg32


QMAKE_CXXFLAGS_RELEASE += /MT

QMAKE_CXXFLAGS_DEBUG += /MTd

HEADERS += \
    browsercontextmenu.h \
    connector/ActionSaver.h \
    connector/DevToolsActionCloseTab.h \
    connector/DevToolsActionCreateTab.h \
    connector/DevToolsActionGetCurrentUrl.h \
    connector/DevToolsActionNavigateBack.h \
    connector/DevToolsActionRequestDeny.h \
    connector/DevToolsActionSetProxy.h \
    connector/DevToolsActionStartScreenCast.h \
    connector/DevToolsActionStopScreenCast.h \
    connector/DevToolsActionSwitchToTab.h \
    connector/DevToolsGlobalState.h \
    connector/DevToolsMultiAction.h \
    connector/ISimpleHttpClient.h \
    connector/ISimpleHttpClientFactory.h \
    connector/IWebSocketClient.h \
    connector/IWebSocketClientFactory.h \
    connector/InputEventsEnumerations.h \
    connector/JsonParser.h \
    connector/JsonSerializer.h \
    connector/KeyboardEmulation.h \
    connector/PrepareUrl.h \
    connector/Variant.h \
    connector/asyncresult.h \
    connector/devtoolsactionexecutejavascript.h \
    connector/devtoolsactionfactory.h \
    connector/devtoolsactiongetbrowsersize.h \
    connector/devtoolsactiongettabs.h \
    connector/devtoolsactionload.h \
    connector/devtoolsactionresizebrowser.h \
    connector/devtoolsactionsetstartupscript.h \
    connector/devtoolsactionwebsocketquery.h \
    connector/devtoolsconnector.h \
    connector/idevtoolsaction.h \
    connector/rawcpphttpclient.h \
    connector/rawcpphttpclientfactory.h \
    connector/rawcppwebsocketclient.h \
    connector/rawcppwebsocketclientfactory.h \
    donothingcallback.h \
    emptyrequestcontexthandler.h \
    fileexists.h \
    fileutils.h \
    ipcsimple.h \
    mainapp.h \
    mainhandler.h \
    newtabschemehandlerfactory.h \
    notificationmanager.h \
    pipesclient.h \
    log.h \
    commandparser.h \
    prepareurladressbar.h \
    processcheck.h \
    proxydata.h \
    resultmanager.h \
    xml_encoder.h \
    devtoolshandler.h \
    cookievisitor.h \
    converter.h \
    json/picojson.h \
    match.h \
    base64.h \
    browserdata.h \
    v8handler.h \
    elementcommand.h \
    javascriptextensions.h \
    browsereventsemulator.h \
    resource.h \
    toolboxhandler.h \
    mainlayout.h \
    scenariohandler.h \
    toolboxv8handler.h \
    scenariov8handler.h \
    inspectresult.h \
    variablesextractor.h \
    extract_functions.h \
    png/lodepng.h \
    settings.h \
    translate.h \
    curlresourcehandler.h \
    opensslmultithreaded.h \
    trim.h \
    split.h \
    readallfile.h \
    refcountpublic.h \
    multithreading.h \
    modulesdata.h \
    toolboxpreprocessor.h \
    replaceall.h \
    convertencoding.h \
    extract_resources.h \
	centralhandler.h \
    handlersmanager.h \
    centralv8handler.h \
    clipboard.h \
    startwith.h \
    processlocation.h \
    urlnormalize.h \
    chromecommandlineparser.h \
    randomid.h \
    CrashHandler.h \
    configurableitem.h \
    localstoragedata.h \
    fixpagecontent.h \
    snappy/snappy.h \
    snappy/snappy-c.h \
    snappy/snappy-internal.h \
    snappy/snappy-sinksource.h \
    snappy/snappy-stubs-internal.h \
    snappy/snappy-stubs-public.h \
    extract_labels.h \
    postmanager.h \
    highlightresult.h \
    imagefinder.h \
    writefile.h \
    aes.h \
    md5.h \
    requestlist.h \
    resourcehandler.h \
    urlrequestclient.h \
    cefrequest2action.h \
    tooltip/gToolTip.h \
    checkvalidutf8.h \
    fillalpharectangle.h \
    generatejsonmenu.h \
    sharedmemoryipc.h \
    emptyapp.h \
    renderapp.h \
    preparestartupscript.h \
    interprocessv8handler.h \
    browserip.h \
    languagemanager.h \
    browsersettingssaver.h \
    detectorhandler.h \
    fingerprintdetector.h \
    detectorv8handler.h \
    browserdirectcontrol.h \
    popup.h

INCLUDEPATH += xml json png snappy tooltip connector

win32:RC_FILE = main.rc

win32:LIBS += -lopencv_core320 -lopencv_imgproc320 -lzlib -lixwebsocket

win32:LIBS += -lWs2_32

DISTFILES += \
    main.rc

QMAKE_LFLAGS_WINDOWS = /SUBSYSTEM:WINDOWS,5.01


