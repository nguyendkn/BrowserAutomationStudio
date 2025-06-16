# API Reference

This document provides comprehensive API documentation for BrowserAutomationStudio components, interfaces, and modules.

## 📋 Table of Contents

- [Core Engine APIs](#core-engine-apis)
- [Browser Automation APIs](#browser-automation-apis)
- [Resource Management APIs](#resource-management-apis)
- [Module System APIs](#module-system-apis)
- [Scheduler APIs](#scheduler-apis)
- [JavaScript Bridge APIs](#javascript-bridge-apis)

## ⚙️ Core Engine APIs

### IMultiWorker Interface

The primary interface for multi-threaded script execution.

#### Methods

```cpp
class IMultiWorker : public QObject
{
public:
    // Configuration
    virtual void SetLogger(ILogger *Logger) = 0;
    virtual void SetBrowserFactory(IBrowserFactory *BrowserFactory) = 0;
    virtual void SetResourceController(IResourceController *ResourceController) = 0;
    virtual void SetSolverFactory(ISolverFactory *SolverFactory) = 0;
    
    // Execution Control
    virtual void Start() = 0;
    virtual void Stop() = 0;
    virtual void Pause() = 0;
    virtual void Resume() = 0;
    
    // Status and Monitoring
    virtual bool IsRunning() = 0;
    virtual int GetActiveWorkerCount() = 0;
    virtual QString GetStatus() = 0;
    
    // Configuration
    virtual void SetThreadCount(int count) = 0;
    virtual void SetScript(const QString& script) = 0;
    virtual void SetResources(IResources* resources) = 0;

signals:
    void Started();
    void Stopped();
    void WorkerFinished(int workerId, const QString& result);
    void ErrorOccurred(const QString& error);
};
```

#### Usage Example

```cpp
// Create and configure worker
ScriptMultiWorker* worker = new ScriptMultiWorker();
worker->SetLogger(logger);
worker->SetBrowserFactory(browserFactory);
worker->SetResourceController(resourceController);
worker->SetThreadCount(4);
worker->SetScript(scriptContent);

// Connect signals
connect(worker, &IMultiWorker::WorkerFinished, 
        this, &MainWindow::OnWorkerFinished);

// Start execution
worker->Start();
```

### IBrowser Interface

Browser abstraction for automation operations.

#### Core Methods

```cpp
class IBrowser : public QObject
{
public:
    // Navigation
    virtual void LoadUrl(const QString& url) = 0;
    virtual void GoBack() = 0;
    virtual void GoForward() = 0;
    virtual void Reload() = 0;
    
    // JavaScript Execution
    virtual QString ExecuteScript(const QString& script) = 0;
    virtual void ExecuteScriptAsync(const QString& script, 
                                   std::function<void(QString)> callback) = 0;
    
    // Element Interaction
    virtual IWebElement* FindElement(const QString& selector) = 0;
    virtual QList<IWebElement*> FindElements(const QString& selector) = 0;
    
    // Page Information
    virtual QString GetUrl() = 0;
    virtual QString GetTitle() = 0;
    virtual QString GetPageSource() = 0;
    
    // Screenshots and Media
    virtual QPixmap TakeScreenshot() = 0;
    virtual void SaveScreenshot(const QString& filename) = 0;
    
    // Browser State
    virtual bool IsLoading() = 0;
    virtual void WaitForLoad(int timeoutMs = 30000) = 0;

signals:
    void LoadFinished(bool success);
    void LoadStarted();
    void UrlChanged(const QString& url);
    void TitleChanged(const QString& title);
};
```

### IWebElement Interface

DOM element interaction interface.

#### Methods

```cpp
class IWebElement : public QObject
{
public:
    // Element Properties
    virtual QString GetTagName() = 0;
    virtual QString GetText() = 0;
    virtual QString GetAttribute(const QString& name) = 0;
    virtual QString GetProperty(const QString& name) = 0;
    virtual QRect GetRect() = 0;
    
    // Element State
    virtual bool IsDisplayed() = 0;
    virtual bool IsEnabled() = 0;
    virtual bool IsSelected() = 0;
    
    // Interaction
    virtual void Click() = 0;
    virtual void DoubleClick() = 0;
    virtual void RightClick() = 0;
    virtual void SendKeys(const QString& text) = 0;
    virtual void Clear() = 0;
    virtual void Submit() = 0;
    
    // Advanced Interaction
    virtual void ScrollIntoView() = 0;
    virtual void Hover() = 0;
    virtual void Focus() = 0;
    
    // Child Elements
    virtual IWebElement* FindChildElement(const QString& selector) = 0;
    virtual QList<IWebElement*> FindChildElements(const QString& selector) = 0;
};
```

## 📊 Resource Management APIs

### IResourceController Interface

Central resource management interface.

#### Methods

```cpp
class IResourceController : public QObject
{
public:
    // Resource Registration
    virtual void RegisterResource(const QString& name, IResourceHandler* handler) = 0;
    virtual void UnregisterResource(const QString& name) = 0;
    
    // Resource Access
    virtual QString GetResource(const QString& name, int workerId = 0) = 0;
    virtual void ReleaseResource(const QString& name, const QString& value, int workerId = 0) = 0;
    
    // Resource Information
    virtual QStringList GetResourceNames() = 0;
    virtual int GetResourceCount(const QString& name) = 0;
    virtual bool IsResourceAvailable(const QString& name) = 0;
    
    // Resource Management
    virtual void ReloadResource(const QString& name) = 0;
    virtual void ClearResourceCache(const QString& name) = 0;

signals:
    void ResourceChanged(const QString& name);
    void ResourceExhausted(const QString& name);
    void ResourceReloaded(const QString& name);
};
```

### Resource Types

#### String Resources

```cpp
// Fixed String Resource
class ResourceModelFixedString : public ResourceModelAbstract
{
public:
    void SetValue(const QString& value);
    QString GetValue() override;
    bool IsInfinite() override { return true; }
};

// File-based String Resource
class ResourceModelFile : public ResourceModelAbstract
{
public:
    void SetFilePath(const QString& path);
    void SetEncoding(const QString& encoding);
    QString GetValue() override;
    int GetTotalCount() override;
};

// Database String Resource
class ResourceModelDatabase : public ResourceModelAbstract
{
public:
    void SetConnectionString(const QString& connection);
    void SetQuery(const QString& query);
    void SetFilters(const QStringList& filters);
    QString GetValue() override;
    void ReleaseValue(const QString& value) override;
};
```

#### Integer Resources

```cpp
// Fixed Integer Resource
class ResourceModelFixedInteger : public ResourceModelAbstract
{
public:
    void SetValue(int value);
    QString GetValue() override;
    bool IsInfinite() override { return true; }
};

// Random Integer Resource
class ResourceModelRandomInteger : public ResourceModelAbstract
{
public:
    void SetRange(int min, int max);
    QString GetValue() override;
    bool IsInfinite() override { return true; }
};
```

## 🔌 Module System APIs

### Module Definition

#### Manifest Structure

```json
{
    "name": "ModuleName",
    "description": "Module description",
    "api_version": 1,
    "major_version": 1,
    "minor_version": 0,
    "developer_name": "Developer",
    "developer_email": "email@example.com",
    "actions": [
        {
            "name": "ActionName",
            "description": {"en": "English", "ru": "Russian"},
            "template": "{{param1}} -> {{param2}}",
            "is_element": false,
            "interface": "action_interface.js",
            "select": "action_select.js",
            "code": [{"file": "action_code.js", "name": "action_code"}]
        }
    ],
    "dll": [
        {
            "name": "module_dll",
            "filename32": "module32.dll",
            "filename64": "module64.dll",
            "exportlist": [
                {
                    "name": "function_name",
                    "isasync": false,
                    "workfunction": "NativeFunctionName"
                }
            ]
        }
    ]
}
```

#### JavaScript Action Interface

```javascript
// Interface Definition (action_interface.js)
function GetInterface() {
    return {
        "InputParameter": {
            "type": "string",
            "description": {"en": "Input parameter", "ru": "Входной параметр"},
            "default": ""
        },
        "OutputVariable": {
            "type": "variable",
            "description": {"en": "Output variable", "ru": "Выходная переменная"}
        }
    };
}

// Code Generation (action_select.js)
function GetCode(loader) {
    var input = GetInputConstructorValue("InputParameter", loader);
    var output = GetInputConstructorValue("OutputVariable", loader);
    
    if (input["original"].length == 0) {
        Invalid(tr("Input parameter is required"));
        return;
    }
    
    var code = _.template($("#action_code").html())({
        "Input": input["updated"],
        "Output": output["updated"]
    });
    
    BrowserAutomationStudio_Append("", code, action, DisableIfAdd);
}

// Implementation (action_code.js)
var result = ProcessInput({{Input}});
{{Output}} = result;
```

## 📅 Scheduler APIs

### REST API Endpoints

#### Task Management

```http
# Get all tasks
GET /tasks/
Response: [{"id": 1, "name": "Task1", "status": "active"}, ...]

# Create new task
POST /tasks/
Body: {
    "name": "TaskName",
    "script": "script_content",
    "schedule": "0 */6 * * *",
    "enabled": true
}

# Update task
PUT /tasks/{id}
Body: {"name": "NewName", "enabled": false}

# Delete task
DELETE /tasks/{id}

# Execute task immediately
POST /tasks/{id}/execute
```

#### Schedule Management

```http
# Get schedule predictions
POST /tasks/predict
Body: {
    "schedule": "0 */6 * * *",
    "timezone": "UTC"
}
Response: {
    "success": true,
    "predictions": ["2025-06-16T06:00:00Z", "2025-06-16T12:00:00Z"],
    "has_more": true
}

# Get execution history
GET /tasks/{id}/history
Response: [
    {
        "id": 1,
        "start_time": "2025-06-16T06:00:00Z",
        "end_time": "2025-06-16T06:05:30Z",
        "status": "completed",
        "result": "success"
    }
]
```

#### System Status

```http
# Get system status
GET /status/
Response: {
    "running_tasks": 2,
    "queued_tasks": 5,
    "system_load": 0.45,
    "memory_usage": "512MB",
    "uptime": "2d 14h 30m"
}

# Get logs
GET /logs/
Query Parameters:
- level: debug|info|warning|error
- limit: number of entries
- offset: pagination offset
```

## 🌐 JavaScript Bridge APIs

### Browser-Side JavaScript APIs

#### BAS Object

```javascript
// Main BAS object available in browser context
window.BAS = {
    // Element interaction
    click: function(selector, options) {},
    type: function(selector, text, options) {},
    select: function(selector, value, options) {},
    
    // Page navigation
    load: function(url, options) {},
    wait: function(condition, timeout) {},
    
    // Data extraction
    get_text: function(selector) {},
    get_attribute: function(selector, attribute) {},
    get_value: function(selector) {},
    
    // Resource access
    get_resource: function(name) {},
    release_resource: function(name, value) {},
    
    // Utility functions
    sleep: function(milliseconds) {},
    random: function(min, max) {},
    log: function(message, level) {}
};
```

#### Advanced APIs

```javascript
// HTTP requests
BAS.http = {
    get: function(url, headers) {},
    post: function(url, data, headers) {},
    put: function(url, data, headers) {},
    delete: function(url, headers) {}
};

// File operations
BAS.file = {
    read: function(path, encoding) {},
    write: function(path, content, encoding) {},
    exists: function(path) {},
    delete: function(path) {}
};

// Database operations
BAS.database = {
    query: function(sql, params) {},
    insert: function(table, data) {},
    update: function(table, data, where) {},
    delete: function(table, where) {}
};
```

---

*For usage examples and tutorials, see the [Examples](../Examples/README.md) section*
