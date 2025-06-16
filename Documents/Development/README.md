# Development Guide

This guide provides comprehensive information for developers working on BrowserAutomationStudio, including coding standards, development workflows, and best practices.

## 📋 Table of Contents

- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Architecture Guidelines](#architecture-guidelines)
- [Testing Practices](#testing-practices)
- [Contributing Guidelines](#contributing-guidelines)
- [Debugging and Profiling](#debugging-and-profiling)

## 🔄 Development Workflow

### Branch Management

#### Branch Naming Convention
```
feature/feature-name          # New features
bugfix/issue-description      # Bug fixes
hotfix/critical-fix          # Critical production fixes
refactor/component-name      # Code refactoring
docs/documentation-update    # Documentation changes
```

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-automation-action
git push -u origin feature/new-automation-action

# Make changes and commit
git add .
git commit -m "Add new automation action for form handling"

# Push changes
git push origin feature/new-automation-action

# Create merge request
# Use GitLab interface to create merge request
```

### Development Types

#### 1. JavaScript-Only Development
For frontend and module development:

```bash
# Build development version
cd basbuild
Development.bat

# Navigate to HTML directory
cd %BAS_BUILD_LOCATION%\build\development\apps\CURRENT_VERSION\html

# Make changes to JavaScript/HTML files
# Test changes by restarting record mode

# Copy changes back to source
copy modified_files %BAS_SOURCE_LOCATION%\Solution\ChromeWorker\html\
```

#### 2. C++ Core Development
For engine and core component development:

```bash
# Build specific component
cd Solution\Engine
qmake Engine.pro
nmake debug

# Test changes
cd %BAS_BUILD_LOCATION%\build\development\apps\CURRENT_VERSION\
BrowserAutomationStudio.exe
```

#### 3. Module Development
For creating new modules:

```bash
# Create module directory
mkdir Solution\Modules\NewModule
cd Solution\Modules\NewModule

# Create module structure
mkdir js
mkdir cpp
mkdir resources

# Implement module (see Module Development section)
```

## 📝 Coding Standards

### C++ Coding Standards

#### Naming Conventions
```cpp
// Classes: PascalCase
class BrowserAutomationEngine {
public:
    // Public methods: PascalCase
    void StartExecution();
    void StopExecution();
    
    // Public members: PascalCase (avoid public members)
    QString CurrentStatus;

private:
    // Private methods: PascalCase
    void InitializeComponents();
    
    // Private members: underscore prefix + PascalCase
    QString _currentScript;
    IBrowser* _browserInstance;
    QList<IWorker*> _workers;
};

// Interfaces: I prefix + PascalCase
class IBrowserFactory {
public:
    virtual IBrowser* CreateBrowser() = 0;
    virtual void ReleaseBrowser(IBrowser* browser) = 0;
};

// Constants: ALL_CAPS
const int MAX_WORKER_COUNT = 100;
const QString DEFAULT_USER_AGENT = "BAS/1.0";

// Enums: PascalCase
enum class ExecutionState {
    Idle,
    Running,
    Paused,
    Stopped,
    Error
};
```

#### Code Structure
```cpp
// Header file structure
#ifndef CLASSNAME_H
#define CLASSNAME_H

// System includes
#include <QObject>
#include <QString>

// Project includes
#include "iinterface.h"
#include "dependency.h"

namespace BrowserAutomationStudioFramework
{
    class ClassName : public QObject, public IInterface
    {
        Q_OBJECT
        
    public:
        explicit ClassName(QObject *parent = nullptr);
        virtual ~ClassName();
        
        // Interface implementation
        void InterfaceMethod() override;
        
        // Public methods
        void PublicMethod();
        
    private slots:
        void OnSignalReceived();
        
    private:
        // Private methods
        void InitializeComponent();
        
        // Private members
        QString _memberVariable;
        QObject* _dependency;
    };
}

#endif // CLASSNAME_H
```

#### Memory Management
```cpp
// Use smart pointers when appropriate
std::unique_ptr<IBrowser> browser = std::make_unique<ChromeBrowser>();

// Qt parent-child relationship for QObject-derived classes
QObject* child = new ChildObject(this); // 'this' becomes parent

// Explicit cleanup when necessary
class ResourceManager {
private:
    QList<IResource*> _resources;
    
public:
    ~ResourceManager() {
        qDeleteAll(_resources);
        _resources.clear();
    }
};
```

### JavaScript Coding Standards

#### Naming Conventions
```javascript
// Variables and functions: camelCase
var currentElement = null;
var isElementVisible = false;

function findElementBySelector(selector) {
    return document.querySelector(selector);
}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;

// Classes: PascalCase
class ActionManager {
    constructor() {
        this.actions = [];
    }
    
    addAction(action) {
        this.actions.push(action);
    }
}

// Private methods: underscore prefix
class ComponentManager {
    _initializeComponent() {
        // Private implementation
    }
    
    publicMethod() {
        this._initializeComponent();
    }
}
```

#### Module Structure
```javascript
// Module pattern
(function(global) {
    'use strict';
    
    // Private variables
    var _moduleState = {};
    var _initialized = false;
    
    // Private functions
    function _validateInput(input) {
        return input && input.length > 0;
    }
    
    // Public API
    var ModuleName = {
        init: function(config) {
            if (_initialized) return;
            
            _moduleState = config || {};
            _initialized = true;
        },
        
        performAction: function(parameters) {
            if (!_initialized) {
                throw new Error('Module not initialized');
            }
            
            if (!_validateInput(parameters.input)) {
                throw new Error('Invalid input parameters');
            }
            
            // Implementation
        }
    };
    
    // Export to global scope
    global.ModuleName = ModuleName;
    
})(window);
```

## 🏗️ Architecture Guidelines

### Dependency Injection Pattern

#### Interface Definition
```cpp
// Define interface
class ILogger {
public:
    virtual void Log(const QString& message, LogLevel level) = 0;
    virtual void SetLogLevel(LogLevel level) = 0;
};

// Implementation
class FileLogger : public ILogger {
public:
    void Log(const QString& message, LogLevel level) override {
        // File logging implementation
    }
};
```

#### Dependency Injection Usage
```cpp
class ScriptExecutor {
private:
    ILogger* _logger;
    IBrowserFactory* _browserFactory;
    IResourceController* _resourceController;
    
public:
    ScriptExecutor(ILogger* logger, 
                   IBrowserFactory* browserFactory,
                   IResourceController* resourceController)
        : _logger(logger)
        , _browserFactory(browserFactory)
        , _resourceController(resourceController)
    {
        Q_ASSERT(_logger != nullptr);
        Q_ASSERT(_browserFactory != nullptr);
        Q_ASSERT(_resourceController != nullptr);
    }
    
    void Execute(const QString& script) {
        _logger->Log("Starting script execution", LogLevel::Info);
        
        auto browser = _browserFactory->CreateBrowser();
        // Use browser for execution
        _browserFactory->ReleaseBrowser(browser);
    }
};
```

### Error Handling

#### C++ Error Handling
```cpp
// Use exceptions for exceptional cases
class BrowserException : public std::exception {
private:
    QString _message;
    
public:
    BrowserException(const QString& message) : _message(message) {}
    
    const char* what() const noexcept override {
        return _message.toUtf8().constData();
    }
};

// Method with error handling
bool ScriptExecutor::ExecuteScript(const QString& script) {
    try {
        // Validate input
        if (script.isEmpty()) {
            _logger->Log("Empty script provided", LogLevel::Error);
            return false;
        }
        
        // Execute script
        auto browser = _browserFactory->CreateBrowser();
        if (!browser) {
            throw BrowserException("Failed to create browser instance");
        }
        
        browser->ExecuteScript(script);
        _browserFactory->ReleaseBrowser(browser);
        
        return true;
        
    } catch (const BrowserException& e) {
        _logger->Log(QString("Browser error: %1").arg(e.what()), LogLevel::Error);
        return false;
    } catch (const std::exception& e) {
        _logger->Log(QString("Unexpected error: %1").arg(e.what()), LogLevel::Error);
        return false;
    }
}
```

#### JavaScript Error Handling
```javascript
function executeAction(actionData) {
    try {
        // Validate input
        if (!actionData || !actionData.type) {
            throw new Error('Invalid action data provided');
        }
        
        // Execute action
        var result = performActionByType(actionData.type, actionData.parameters);
        
        return {
            success: true,
            result: result
        };
        
    } catch (error) {
        console.error('Action execution failed:', error.message);
        
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}
```

### Logging and Debugging

#### Structured Logging
```cpp
// Log levels
enum class LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical
};

// Structured logging
class StructuredLogger : public ILogger {
public:
    void Log(const QString& message, LogLevel level) override {
        QJsonObject logEntry;
        logEntry["timestamp"] = QDateTime::currentDateTime().toString(Qt::ISODate);
        logEntry["level"] = LogLevelToString(level);
        logEntry["message"] = message;
        logEntry["thread"] = QString::number(reinterpret_cast<qintptr>(QThread::currentThread()));
        
        WriteLogEntry(logEntry);
    }
    
    void LogWithContext(const QString& message, LogLevel level, const QJsonObject& context) {
        QJsonObject logEntry;
        logEntry["timestamp"] = QDateTime::currentDateTime().toString(Qt::ISODate);
        logEntry["level"] = LogLevelToString(level);
        logEntry["message"] = message;
        logEntry["context"] = context;
        
        WriteLogEntry(logEntry);
    }
};
```

#### Debug Macros
```cpp
// Debug macros for development
#ifdef _DEBUG
    #define WORKER_LOG(msg) qDebug() << "[WORKER]" << msg
    #define BROWSER_LOG(msg) qDebug() << "[BROWSER]" << msg
    #define ENGINE_LOG(msg) qDebug() << "[ENGINE]" << msg
#else
    #define WORKER_LOG(msg)
    #define BROWSER_LOG(msg)
    #define ENGINE_LOG(msg)
#endif

// Usage
void BrowserWorker::LoadPage(const QString& url) {
    BROWSER_LOG("Loading page:" << url);
    
    // Implementation
    
    BROWSER_LOG("Page loaded successfully");
}
```

## 🧪 Testing Practices

### Unit Testing

#### Test Structure
```cpp
// Test class
class ScriptExecutorTest : public QObject {
    Q_OBJECT
    
private slots:
    void initTestCase();
    void cleanupTestCase();
    void init();
    void cleanup();
    
    // Test methods
    void testScriptExecution();
    void testInvalidScript();
    void testResourceAccess();
    
private:
    ScriptExecutor* _executor;
    MockLogger* _mockLogger;
    MockBrowserFactory* _mockBrowserFactory;
};

// Test implementation
void ScriptExecutorTest::testScriptExecution() {
    // Arrange
    QString testScript = "console.log('test');";
    EXPECT_CALL(*_mockBrowserFactory, CreateBrowser())
        .WillOnce(Return(new MockBrowser()));
    
    // Act
    bool result = _executor->ExecuteScript(testScript);
    
    // Assert
    QVERIFY(result);
    QVERIFY(_mockLogger->HasLogEntry("Starting script execution"));
}
```

### Integration Testing

#### Browser Integration Tests
```cpp
class BrowserIntegrationTest : public QObject {
    Q_OBJECT
    
private slots:
    void testPageNavigation();
    void testElementInteraction();
    void testJavaScriptExecution();
    
private:
    IBrowser* _browser;
};

void BrowserIntegrationTest::testPageNavigation() {
    // Load test page
    _browser->LoadUrl("file:///test/pages/simple.html");
    _browser->WaitForLoad();
    
    // Verify navigation
    QCOMPARE(_browser->GetUrl(), "file:///test/pages/simple.html");
    QVERIFY(_browser->GetTitle().contains("Test Page"));
}
```

## 🤝 Contributing Guidelines

### Code Review Process

#### Before Submitting
1. **Self-review**: Review your own code thoroughly
2. **Testing**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Formatting**: Follow coding standards
5. **Dependencies**: Minimize new dependencies

#### Merge Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Commit Message Format
```
type(scope): brief description

Detailed description of changes if necessary.

Fixes #issue_number
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(engine): add support for parallel resource loading

Implements parallel loading of string resources to improve
performance for large datasets.

Fixes #123
```

---

*For module development specifics, see the [Module Development Guide](../Modules/README.md)*
