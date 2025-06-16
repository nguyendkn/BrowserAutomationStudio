# Code Examples and Use Cases

This document provides practical examples and use cases for BrowserAutomationStudio development, including common patterns, implementation examples, and best practices.

## 📋 Table of Contents

- [Basic Automation Examples](#basic-automation-examples)
- [Module Development Examples](#module-development-examples)
- [Engine Integration Examples](#engine-integration-examples)
- [Advanced Use Cases](#advanced-use-cases)
- [Common Patterns](#common-patterns)
- [Troubleshooting Examples](#troubleshooting-examples)

## 🤖 Basic Automation Examples

### Simple Web Scraping
```javascript
// Basic web scraping script
try {
    // Navigate to target website
    load("https://example.com/products");
    wait_for_element(".product-list", 10000);
    
    // Extract product information
    var products = [];
    var productElements = get_elements(".product-item");
    
    for (var i = 0; i < productElements.length; i++) {
        var product = {
            name: get_text(productElements[i] + " .product-name"),
            price: get_text(productElements[i] + " .product-price"),
            url: get_attribute(productElements[i] + " a", "href")
        };
        products.push(product);
    }
    
    // Save results
    console.log("Found " + products.length + " products");
    save_to_file("products.json", JSON.stringify(products, null, 2));
    
} catch (error) {
    console.error("Scraping failed: " + error.message);
    throw error;
}
```

### Form Automation
```javascript
// Automated form filling and submission
try {
    // Load form page
    load("https://example.com/contact-form");
    wait_for_element("#contact-form", 5000);
    
    // Fill form fields
    type("#name", get_resource("contact_names"));
    type("#email", get_resource("email_addresses"));
    type("#phone", generate_phone_number());
    
    // Select dropdown option
    select("#country", "United States");
    
    // Fill textarea
    type("#message", "This is an automated test message.");
    
    // Handle checkbox
    if (!is_checked("#newsletter")) {
        click("#newsletter");
    }
    
    // Submit form
    click("#submit-button");
    
    // Wait for confirmation
    wait_for_element(".success-message", 10000);
    var confirmationText = get_text(".success-message");
    
    console.log("Form submitted successfully: " + confirmationText);
    
} catch (error) {
    console.error("Form submission failed: " + error.message);
    take_screenshot("form_error.png");
    throw error;
}
```

### Login Automation
```javascript
// Automated login with error handling
function performLogin(username, password) {
    try {
        // Navigate to login page
        load("https://example.com/login");
        wait_for_element("#login-form", 5000);
        
        // Clear existing values
        clear("#username");
        clear("#password");
        
        // Enter credentials
        type("#username", username);
        type("#password", password);
        
        // Submit login form
        click("#login-button");
        
        // Wait for either success or error
        var result = wait_for_any([
            ".dashboard",      // Success indicator
            ".error-message"   // Error indicator
        ], 10000);
        
        if (result === ".dashboard") {
            console.log("Login successful for user: " + username);
            return true;
        } else {
            var errorMsg = get_text(".error-message");
            console.error("Login failed: " + errorMsg);
            return false;
        }
        
    } catch (error) {
        console.error("Login process error: " + error.message);
        return false;
    }
}

// Usage with resource management
var username = get_resource("usernames");
var password = get_resource("passwords");

if (performLogin(username, password)) {
    // Continue with authenticated actions
    console.log("Proceeding with authenticated session");
} else {
    // Handle login failure
    release_resource("usernames", username);
    release_resource("passwords", password);
    throw new Error("Authentication failed");
}
```

## 🔌 Module Development Examples

### Simple String Processing Module
```javascript
// Module: StringProcessor
// File: js/manifest.json
{
    "name": "StringProcessor",
    "description": "Advanced string processing utilities",
    "api_version": 1,
    "actions": [
        {
            "name": "StringProcessor_Transform",
            "description": {
                "en": "Transform string with multiple operations",
                "ru": "Преобразовать строку с несколькими операциями"
            },
            "template": "{{Input}} -> {{Operations}} -> {{Output}}",
            "interface": "string_transform_interface.js",
            "select": "string_transform_select.js",
            "code": [{"file": "string_transform_code.js", "name": "string_transform_code"}]
        }
    ]
}

// File: js/string_transform_interface.js
function GetInterface() {
    return {
        "Input": {
            "type": "string",
            "description": {"en": "Input string", "ru": "Входная строка"},
            "required": true
        },
        "Operations": {
            "type": "multiselect",
            "description": {"en": "Operations to perform", "ru": "Операции для выполнения"},
            "options": [
                {"value": "uppercase", "text": {"en": "Uppercase", "ru": "Верхний регистр"}},
                {"value": "lowercase", "text": {"en": "Lowercase", "ru": "Нижний регистр"}},
                {"value": "reverse", "text": {"en": "Reverse", "ru": "Обратить"}},
                {"value": "trim", "text": {"en": "Trim", "ru": "Обрезать пробелы"}},
                {"value": "removeSpaces", "text": {"en": "Remove Spaces", "ru": "Удалить пробелы"}}
            ]
        },
        "Output": {
            "type": "variable",
            "description": {"en": "Output variable", "ru": "Выходная переменная"},
            "required": true
        }
    };
}

// File: js/string_transform_code.js
<script type="text/template" id="string_transform_code">
try {
    var input = {{Input}};
    var operations = {{Operations}};
    var result = input;
    
    // Apply each operation in sequence
    for (var i = 0; i < operations.length; i++) {
        switch (operations[i]) {
            case 'uppercase':
                result = result.toUpperCase();
                break;
            case 'lowercase':
                result = result.toLowerCase();
                break;
            case 'reverse':
                result = result.split('').reverse().join('');
                break;
            case 'trim':
                result = result.trim();
                break;
            case 'removeSpaces':
                result = result.replace(/\s+/g, '');
                break;
            default:
                console.warn('Unknown operation: ' + operations[i]);
        }
    }
    
    {{Output}} = result;
    console.log('String transformation completed: ' + operations.join(', '));
    
} catch (error) {
    console.error('StringProcessor error: ' + error.message);
    throw error;
}
</script>
```

### HTTP Client Module with Native Extension
```cpp
// File: cpp/httpclient.h
#ifndef HTTPCLIENT_MODULE_H
#define HTTPCLIENT_MODULE_H

#include <QString>
#include <QJsonObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>

extern "C" {
    __declspec(dllexport) void StartDll();
    __declspec(dllexport) void EndDll();
    __declspec(dllexport) QString HttpGet(const QString& url, const QString& headers);
    __declspec(dllexport) QString HttpPost(const QString& url, const QString& data, const QString& headers);
}

class HttpClientModule {
public:
    static QString PerformRequest(const QString& method, const QString& url, 
                                 const QString& data, const QJsonObject& headers);
    static QJsonObject ParseHeaders(const QString& headerString);
    static QString FormatResponse(QNetworkReply* reply);
    
private:
    static QNetworkAccessManager* s_networkManager;
    static void InitializeNetworkManager();
    static void CleanupNetworkManager();
};

#endif // HTTPCLIENT_MODULE_H

// File: cpp/httpclient.cpp
#include "httpclient.h"
#include <QEventLoop>
#include <QTimer>
#include <QJsonDocument>
#include <QNetworkRequest>

QNetworkAccessManager* HttpClientModule::s_networkManager = nullptr;

void StartDll() {
    HttpClientModule::InitializeNetworkManager();
}

void EndDll() {
    HttpClientModule::CleanupNetworkManager();
}

QString HttpGet(const QString& url, const QString& headers) {
    return HttpClientModule::PerformRequest("GET", url, "", 
                                           HttpClientModule::ParseHeaders(headers));
}

QString HttpPost(const QString& url, const QString& data, const QString& headers) {
    return HttpClientModule::PerformRequest("POST", url, data, 
                                           HttpClientModule::ParseHeaders(headers));
}

QString HttpClientModule::PerformRequest(const QString& method, const QString& url, 
                                        const QString& data, const QJsonObject& headers) {
    if (!s_networkManager) {
        return "{\"error\": \"Network manager not initialized\"}";
    }
    
    QNetworkRequest request(url);
    
    // Set headers
    for (auto it = headers.begin(); it != headers.end(); ++it) {
        request.setRawHeader(it.key().toUtf8(), it.value().toString().toUtf8());
    }
    
    // Set default headers
    request.setRawHeader("User-Agent", "BAS-HttpClient/1.0");
    
    QNetworkReply* reply = nullptr;
    
    if (method == "GET") {
        reply = s_networkManager->get(request);
    } else if (method == "POST") {
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
        reply = s_networkManager->post(request, data.toUtf8());
    } else {
        return "{\"error\": \"Unsupported HTTP method\"}";
    }
    
    // Wait for response with timeout
    QEventLoop loop;
    QTimer timer;
    timer.setSingleShot(true);
    timer.setInterval(30000); // 30 second timeout
    
    QObject::connect(reply, &QNetworkReply::finished, &loop, &QEventLoop::quit);
    QObject::connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);
    
    timer.start();
    loop.exec();
    
    QString result = FormatResponse(reply);
    reply->deleteLater();
    
    return result;
}

QString HttpClientModule::FormatResponse(QNetworkReply* reply) {
    QJsonObject response;
    
    if (reply->error() == QNetworkReply::NoError) {
        response["success"] = true;
        response["status_code"] = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        response["data"] = QString::fromUtf8(reply->readAll());
        
        // Add response headers
        QJsonObject responseHeaders;
        for (const auto& header : reply->rawHeaderList()) {
            responseHeaders[QString::fromUtf8(header)] = QString::fromUtf8(reply->rawHeader(header));
        }
        response["headers"] = responseHeaders;
        
    } else {
        response["success"] = false;
        response["error"] = reply->errorString();
        response["error_code"] = reply->error();
    }
    
    return QJsonDocument(response).toJson(QJsonDocument::Compact);
}
```

## ⚙️ Engine Integration Examples

### Custom Resource Handler
```cpp
// Custom database resource handler
class CustomDatabaseResourceHandler : public ResourceHandlerAbstract
{
    Q_OBJECT
    
public:
    explicit CustomDatabaseResourceHandler(const QString& connectionString, 
                                          const QString& query,
                                          QObject* parent = nullptr);
    
    QString GetValue() override;
    void ReleaseValue(const QString& value) override;
    int GetTotalCount() override;
    bool IsInfinite() override { return false; }
    
private slots:
    void OnDatabaseConnected();
    void OnDatabaseError(const QString& error);
    
private:
    void InitializeDatabase();
    void LoadData();
    
    QString _connectionString;
    QString _query;
    QSqlDatabase _database;
    QStringList _data;
    QSet<QString> _usedValues;
    int _currentIndex;
    bool _isConnected;
};

CustomDatabaseResourceHandler::CustomDatabaseResourceHandler(
    const QString& connectionString, 
    const QString& query,
    QObject* parent)
    : ResourceHandlerAbstract(parent)
    , _connectionString(connectionString)
    , _query(query)
    , _currentIndex(0)
    , _isConnected(false)
{
    InitializeDatabase();
}

QString CustomDatabaseResourceHandler::GetValue()
{
    if (!_isConnected || _data.isEmpty()) {
        throw std::runtime_error("Database resource not available");
    }
    
    if (_currentIndex >= _data.size()) {
        throw std::runtime_error("No more values available");
    }
    
    QString value = _data[_currentIndex];
    _usedValues.insert(value);
    _currentIndex++;
    
    return value;
}

void CustomDatabaseResourceHandler::ReleaseValue(const QString& value)
{
    // Mark value as available for reuse
    _usedValues.remove(value);
    
    // Reset index if all values have been released
    if (_usedValues.isEmpty()) {
        _currentIndex = 0;
    }
}

void CustomDatabaseResourceHandler::InitializeDatabase()
{
    _database = QSqlDatabase::addDatabase("QSQLITE", 
                                         QString("resource_%1").arg(reinterpret_cast<qintptr>(this)));
    _database.setDatabaseName(_connectionString);
    
    if (_database.open()) {
        _isConnected = true;
        LoadData();
    } else {
        emit ErrorOccurred("Failed to connect to database: " + _database.lastError().text());
    }
}

void CustomDatabaseResourceHandler::LoadData()
{
    QSqlQuery query(_database);
    if (query.exec(_query)) {
        while (query.next()) {
            _data.append(query.value(0).toString());
        }
        emit DataLoaded(_data.size());
    } else {
        emit ErrorOccurred("Query execution failed: " + query.lastError().text());
    }
}
```

### Custom Browser Factory
```cpp
// Custom browser factory with specific configuration
class CustomBrowserFactory : public IBrowserFactory
{
    Q_OBJECT
    
public:
    explicit CustomBrowserFactory(const QJsonObject& config, QObject* parent = nullptr);
    
    IBrowser* CreateBrowser() override;
    void ReleaseBrowser(IBrowser* browser) override;
    bool IsAvailable() override;
    
    void SetProxyConfiguration(const QString& proxy);
    void SetUserAgent(const QString& userAgent);
    void SetWindowSize(int width, int height);
    
private:
    QJsonObject _configuration;
    QList<IBrowser*> _activeBrowsers;
    QString _proxyConfiguration;
    QString _userAgent;
    QSize _windowSize;
    int _maxBrowsers;
};

IBrowser* CustomBrowserFactory::CreateBrowser()
{
    if (_activeBrowsers.size() >= _maxBrowsers) {
        qWarning() << "Maximum browser limit reached";
        return nullptr;
    }
    
    auto browser = new SubprocessBrowser(this);
    
    // Apply configuration
    if (!_proxyConfiguration.isEmpty()) {
        browser->SetProxy(_proxyConfiguration);
    }
    
    if (!_userAgent.isEmpty()) {
        browser->SetUserAgent(_userAgent);
    }
    
    if (_windowSize.isValid()) {
        browser->SetWindowSize(_windowSize);
    }
    
    // Apply additional settings from configuration
    if (_configuration.contains("enableImages")) {
        browser->SetImagesEnabled(_configuration["enableImages"].toBool());
    }
    
    if (_configuration.contains("enableJavaScript")) {
        browser->SetJavaScriptEnabled(_configuration["enableJavaScript"].toBool());
    }
    
    _activeBrowsers.append(browser);
    
    connect(browser, &IBrowser::Destroyed, [this, browser]() {
        _activeBrowsers.removeOne(browser);
    });
    
    return browser;
}
```

## 🚀 Advanced Use Cases

### Multi-threaded Data Processing
```cpp
// Advanced multi-threaded processing with resource management
class DataProcessingWorker : public QObject
{
    Q_OBJECT
    
public:
    explicit DataProcessingWorker(int workerId, 
                                 IResourceController* resourceController,
                                 QObject* parent = nullptr);
    
public slots:
    void ProcessData();
    
signals:
    void DataProcessed(int workerId, const QJsonObject& result);
    void ErrorOccurred(int workerId, const QString& error);
    
private:
    int _workerId;
    IResourceController* _resourceController;
    
    QJsonObject ProcessSingleItem(const QString& data);
    void SaveResults(const QJsonArray& results);
};

void DataProcessingWorker::ProcessData()
{
    QJsonArray results;
    int processedCount = 0;
    
    try {
        while (true) {
            // Get data from resource
            QString data = _resourceController->GetResource("input_data", _workerId);
            if (data.isEmpty()) {
                break; // No more data available
            }
            
            // Process data
            QJsonObject result = ProcessSingleItem(data);
            results.append(result);
            processedCount++;
            
            // Release resource
            _resourceController->ReleaseResource("input_data", data, _workerId);
            
            // Periodic progress update
            if (processedCount % 100 == 0) {
                qDebug() << "Worker" << _workerId << "processed" << processedCount << "items";
            }
        }
        
        // Save results
        SaveResults(results);
        
        QJsonObject summary;
        summary["worker_id"] = _workerId;
        summary["processed_count"] = processedCount;
        summary["success"] = true;
        
        emit DataProcessed(_workerId, summary);
        
    } catch (const std::exception& e) {
        emit ErrorOccurred(_workerId, QString("Processing error: %1").arg(e.what()));
    }
}

QJsonObject DataProcessingWorker::ProcessSingleItem(const QString& data)
{
    QJsonObject item;
    item["original_data"] = data;
    item["processed_at"] = QDateTime::currentDateTime().toString(Qt::ISODate);
    item["worker_id"] = _workerId;
    
    // Perform actual processing
    QString processedData = data.toUpper().trimmed();
    item["processed_data"] = processedData;
    
    // Add metadata
    item["length"] = data.length();
    item["word_count"] = data.split(' ', Qt::SkipEmptyParts).size();
    
    return item;
}
```

### Dynamic Module Loading
```javascript
// Dynamic module loading and execution
class ModuleExecutor {
    constructor() {
        this.loadedModules = new Map();
        this.moduleCache = new Map();
    }
    
    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }
        
        try {
            // Load module manifest
            const manifest = await this.loadModuleManifest(moduleName);
            
            // Load module code
            const moduleCode = await this.loadModuleCode(moduleName, manifest);
            
            // Initialize module
            const moduleInstance = this.initializeModule(moduleName, manifest, moduleCode);
            
            this.loadedModules.set(moduleName, moduleInstance);
            return moduleInstance;
            
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }
    
    async executeModuleAction(moduleName, actionName, parameters) {
        const module = await this.loadModule(moduleName);
        
        if (!module.actions.has(actionName)) {
            throw new Error(`Action ${actionName} not found in module ${moduleName}`);
        }
        
        const action = module.actions.get(actionName);
        
        try {
            // Validate parameters
            this.validateParameters(action.interface, parameters);
            
            // Execute action
            const result = await action.execute(parameters);
            
            return {
                success: true,
                result: result,
                module: moduleName,
                action: actionName
            };
            
        } catch (error) {
            console.error(`Module action execution failed:`, error);
            return {
                success: false,
                error: error.message,
                module: moduleName,
                action: actionName
            };
        }
    }
    
    validateParameters(interface, parameters) {
        for (const [paramName, paramDef] of Object.entries(interface)) {
            if (paramDef.required && !(paramName in parameters)) {
                throw new Error(`Required parameter missing: ${paramName}`);
            }
            
            if (paramName in parameters) {
                this.validateParameterType(paramName, paramDef, parameters[paramName]);
            }
        }
    }
    
    validateParameterType(paramName, paramDef, value) {
        switch (paramDef.type) {
            case 'string':
                if (typeof value !== 'string') {
                    throw new Error(`Parameter ${paramName} must be a string`);
                }
                break;
            case 'number':
                if (typeof value !== 'number') {
                    throw new Error(`Parameter ${paramName} must be a number`);
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    throw new Error(`Parameter ${paramName} must be a boolean`);
                }
                break;
            // Add more type validations as needed
        }
    }
}

// Usage example
const executor = new ModuleExecutor();

async function processData() {
    try {
        // Load and execute string processing
        const stringResult = await executor.executeModuleAction('String', 'ToUpperCase', {
            input: 'hello world',
            output: 'result'
        });
        
        console.log('String processing result:', stringResult);
        
        // Load and execute JSON processing
        const jsonResult = await executor.executeModuleAction('JSON', 'Parse', {
            jsonString: '{"name": "test", "value": 123}',
            output: 'parsedData'
        });
        
        console.log('JSON processing result:', jsonResult);
        
    } catch (error) {
        console.error('Processing failed:', error);
    }
}
```

## 🔧 Common Patterns

### Error Handling Pattern
```javascript
// Comprehensive error handling pattern
function executeWithRetry(operation, maxRetries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        function attempt() {
            attempts++;
            
            try {
                const result = operation();
                resolve(result);
            } catch (error) {
                console.warn(`Attempt ${attempts} failed:`, error.message);
                
                if (attempts >= maxRetries) {
                    reject(new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`));
                } else {
                    setTimeout(attempt, delay * attempts); // Exponential backoff
                }
            }
        }
        
        attempt();
    });
}

// Usage
async function robustWebScraping() {
    try {
        await executeWithRetry(() => {
            load("https://example.com");
            wait_for_element(".content", 5000);
        }, 3, 2000);
        
        const data = await executeWithRetry(() => {
            return get_text(".important-data");
        }, 2, 1000);
        
        console.log("Data extracted:", data);
        
    } catch (error) {
        console.error("Scraping failed completely:", error.message);
        take_screenshot("final_error.png");
        throw error;
    }
}
```

### Resource Management Pattern
```cpp
// RAII resource management pattern
class ScopedResource {
public:
    ScopedResource(IResourceController* controller, const QString& resourceName, int workerId)
        : _controller(controller)
        , _resourceName(resourceName)
        , _workerId(workerId)
        , _value(_controller->GetResource(resourceName, workerId))
    {
    }
    
    ~ScopedResource() {
        if (_controller && !_value.isEmpty()) {
            _controller->ReleaseResource(_resourceName, _value, _workerId);
        }
    }
    
    const QString& GetValue() const { return _value; }
    
    // Disable copy constructor and assignment
    ScopedResource(const ScopedResource&) = delete;
    ScopedResource& operator=(const ScopedResource&) = delete;
    
private:
    IResourceController* _controller;
    QString _resourceName;
    int _workerId;
    QString _value;
};

// Usage
void ProcessWithResource(IResourceController* controller, int workerId) {
    ScopedResource username(controller, "usernames", workerId);
    ScopedResource password(controller, "passwords", workerId);
    
    // Use resources
    PerformLogin(username.GetValue(), password.GetValue());
    
    // Resources are automatically released when going out of scope
}
```

---

*These examples demonstrate practical implementation patterns and best practices for BrowserAutomationStudio development.*
