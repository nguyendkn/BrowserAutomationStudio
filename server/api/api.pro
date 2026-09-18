QT -= gui
QT += network websockets sql
CONFIG += c++17 console
CONFIG -= app_bundle
TARGET = basapi
TEMPLATE = app
DEFINES += QT_DEPRECATED_WARNINGS
INCLUDEPATH += $$PWD $$PWD/../core $$PWD/http
DEPENDPATH += $$PWD $$PWD/../core
include($$PWD/http/httpserver.pri)
HEADERS += $$PWD/apiserver.h $$PWD/controllers/healthcontroller.h $$PWD/controllers/taskcontroller.h $$PWD/ws/eventhub.h $$PWD/auth/authfilter.h
SOURCES += $$PWD/main.cpp $$PWD/apiserver.cpp $$PWD/controllers/healthcontroller.cpp $$PWD/controllers/taskcontroller.cpp $$PWD/ws/eventhub.cpp $$PWD/auth/authfilter.cpp
LIBS += -L$$OUT_PWD/../core/release -lbascore
win32:CONFIG(debug,debug|release): LIBS += -L$$OUT_PWD/../core/debug -lbascore
