# Coding Standards and Style Guide

This document defines the coding standards, style guidelines, and best practices for BrowserAutomationStudio development.

## 📋 Table of Contents

- [General Principles](#general-principles)
- [C++ Standards](#c-standards)
- [JavaScript Standards](#javascript-standards)
- [Qt-Specific Guidelines](#qt-specific-guidelines)
- [Documentation Standards](#documentation-standards)
- [File Organization](#file-organization)

## 🎯 General Principles

### Core Values
1. **Readability**: Code should be self-documenting and easy to understand
2. **Consistency**: Follow established patterns throughout the codebase
3. **Maintainability**: Write code that is easy to modify and extend
4. **Performance**: Consider performance implications of design decisions
5. **Testability**: Design code to be easily testable

### Design Principles
- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't implement features until they're needed

## 🔧 C++ Standards

### Naming Conventions

#### Classes and Interfaces
```cpp
// Classes: PascalCase
class BrowserAutomationEngine {
    // Implementation
};

// Interfaces: I prefix + PascalCase
class IBrowserFactory {
    // Interface definition
};

// Abstract classes: descriptive names
class ResourceHandlerAbstract {
    // Abstract implementation
};
```

#### Methods and Functions
```cpp
class ExampleClass {
public:
    // Public methods: PascalCase
    void StartExecution();
    void StopExecution();
    bool IsRunning() const;
    
    // Getters/Setters: Get/Set prefix
    QString GetCurrentStatus() const;
    void SetCurrentStatus(const QString& status);
    
private:
    // Private methods: PascalCase
    void InitializeComponents();
    void CleanupResources();
};

// Free functions: PascalCase
QString FormatErrorMessage(const QString& error);
bool ValidateInput(const QString& input);
```

#### Variables and Members
```cpp
class ExampleClass {
private:
    // Private members: underscore prefix + PascalCase
    QString _currentScript;
    IBrowser* _browserInstance;
    QList<IWorker*> _workers;
    bool _isInitialized;
    
    // Static members: s_ prefix
    static QString s_defaultUserAgent;
    static int s_instanceCount;
};

// Local variables: camelCase
void SomeFunction() {
    QString localVariable = "value";
    int iterationCount = 0;
    bool isValid = false;
}

// Constants: ALL_CAPS with underscores
const int MAX_RETRY_COUNT = 3;
const QString DEFAULT_TIMEOUT = "30000";
```

#### Enums
```cpp
// Enum class: PascalCase
enum class ExecutionState {
    Idle,
    Running,
    Paused,
    Stopped,
    Error
};

// Usage
ExecutionState currentState = ExecutionState::Running;
```

### Code Structure

#### Header File Template
```cpp
#ifndef CLASSNAME_H
#define CLASSNAME_H

// System includes (alphabetical order)
#include <QObject>
#include <QString>
#include <QTimer>

// Project includes (alphabetical order)
#include "iinterface.h"
#include "dependency.h"

// Forward declarations
class QNetworkAccessManager;
class IBrowser;

namespace BrowserAutomationStudioFramework
{
    /**
     * @brief Brief description of the class
     * 
     * Detailed description of the class purpose,
     * usage, and any important notes.
     */
    class ENGINESHARED_EXPORT ClassName : public QObject, public IInterface
    {
        Q_OBJECT
        
    public:
        /**
         * @brief Constructor
         * @param parent Parent QObject
         */
        explicit ClassName(QObject *parent = nullptr);
        
        /**
         * @brief Destructor
         */
        virtual ~ClassName();
        
        // Interface implementation
        void InterfaceMethod() override;
        
        // Public methods (grouped by functionality)
        void StartOperation();
        void StopOperation();
        bool IsOperationRunning() const;
        
        // Getters and setters
        QString GetStatus() const;
        void SetConfiguration(const QJsonObject& config);
        
    public slots:
        void OnExternalEvent();
        
    signals:
        void OperationStarted();
        void OperationFinished(bool success);
        void ErrorOccurred(const QString& error);
        
    private slots:
        void OnInternalTimer();
        
    private:
        // Private methods
        void InitializeComponent();
        void CleanupResources();
        bool ValidateConfiguration() const;
        
        // Private members (grouped by purpose)
        // Core functionality
        QString _currentStatus;
        QTimer* _internalTimer;
        
        // Dependencies
        IBrowser* _browser;
        QNetworkAccessManager* _networkManager;
        
        // Configuration
        QJsonObject _configuration;
        bool _isInitialized;
    };
}

#endif // CLASSNAME_H
```

#### Implementation File Template
```cpp
#include "classname.h"

// System includes
#include <QDebug>
#include <QJsonObject>
#include <QTimer>

// Project includes
#include "ibrowser.h"
#include "logger.h"

namespace BrowserAutomationStudioFramework
{

ClassName::ClassName(QObject *parent)
    : QObject(parent)
    , _currentStatus("Idle")
    , _internalTimer(new QTimer(this))
    , _browser(nullptr)
    , _networkManager(nullptr)
    , _isInitialized(false)
{
    // Connect signals
    connect(_internalTimer, &QTimer::timeout, 
            this, &ClassName::OnInternalTimer);
    
    // Initialize component
    InitializeComponent();
}

ClassName::~ClassName()
{
    CleanupResources();
}

void ClassName::InterfaceMethod()
{
    // Interface implementation
    if (!_isInitialized) {
        qWarning() << "ClassName: Component not initialized";
        return;
    }
    
    // Implementation logic
}

void ClassName::StartOperation()
{
    if (_currentStatus == "Running") {
        qDebug() << "ClassName: Operation already running";
        return;
    }
    
    _currentStatus = "Running";
    _internalTimer->start(1000);
    
    emit OperationStarted();
}

void ClassName::InitializeComponent()
{
    // Initialization logic
    _isInitialized = true;
    qDebug() << "ClassName: Component initialized successfully";
}

void ClassName::CleanupResources()
{
    if (_internalTimer) {
        _internalTimer->stop();
    }
    
    // Cleanup other resources
    _isInitialized = false;
}

} // namespace BrowserAutomationStudioFramework
```

### Memory Management

#### RAII and Smart Pointers
```cpp
// Use smart pointers for automatic memory management
class ResourceManager {
private:
    std::unique_ptr<IBrowser> _browser;
    std::shared_ptr<ILogger> _logger;
    
public:
    ResourceManager() 
        : _browser(std::make_unique<ChromeBrowser>())
        , _logger(std::make_shared<FileLogger>())
    {
    }
    
    // No need for explicit destructor - smart pointers handle cleanup
};

// Qt parent-child relationship for QObject-derived classes
class ComponentManager : public QObject {
public:
    ComponentManager(QObject* parent = nullptr) : QObject(parent) {
        // Child objects are automatically deleted when parent is destroyed
        auto* timer = new QTimer(this);
        auto* networkManager = new QNetworkAccessManager(this);
    }
};
```

#### Manual Memory Management
```cpp
// When manual management is necessary
class LegacyResourceManager {
private:
    QList<IResource*> _resources;
    
public:
    ~LegacyResourceManager() {
        // Clean up all resources
        qDeleteAll(_resources);
        _resources.clear();
    }
    
    void AddResource(IResource* resource) {
        if (resource) {
            _resources.append(resource);
        }
    }
};
```

### Error Handling

#### Exception Usage
```cpp
// Custom exception classes
class BrowserException : public std::exception {
private:
    QString _message;
    
public:
    explicit BrowserException(const QString& message) : _message(message) {}
    
    const char* what() const noexcept override {
        return _message.toUtf8().constData();
    }
    
    QString GetMessage() const { return _message; }
};

// Exception handling in methods
bool ScriptExecutor::ExecuteScript(const QString& script) {
    try {
        ValidateScript(script);
        
        auto browser = _browserFactory->CreateBrowser();
        if (!browser) {
            throw BrowserException("Failed to create browser instance");
        }
        
        browser->ExecuteScript(script);
        return true;
        
    } catch (const BrowserException& e) {
        _logger->LogError(QString("Browser error: %1").arg(e.GetMessage()));
        return false;
    } catch (const std::exception& e) {
        _logger->LogError(QString("Unexpected error: %1").arg(e.what()));
        return false;
    }
}
```

#### Return Value Error Handling
```cpp
// For non-exceptional error cases
enum class OperationResult {
    Success,
    InvalidInput,
    NetworkError,
    TimeoutError,
    UnknownError
};

OperationResult PerformNetworkOperation(const QString& url) {
    if (url.isEmpty()) {
        return OperationResult::InvalidInput;
    }
    
    // Perform operation
    if (networkTimeout) {
        return OperationResult::TimeoutError;
    }
    
    return OperationResult::Success;
}
```

## 📜 JavaScript Standards

### Naming Conventions

#### Variables and Functions
```javascript
// Variables: camelCase
var currentElement = null;
var isElementVisible = false;
var elementCount = 0;

// Functions: camelCase
function findElementBySelector(selector) {
    return document.querySelector(selector);
}

function validateInputParameters(parameters) {
    return parameters && parameters.length > 0;
}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINTS = {
    USERS: '/api/users',
    TASKS: '/api/tasks'
};
```

#### Classes and Objects
```javascript
// Classes: PascalCase
class ActionManager {
    constructor(options = {}) {
        this.actions = [];
        this.options = options;
        this._initialized = false;
    }
    
    // Public methods: camelCase
    addAction(action) {
        if (this._validateAction(action)) {
            this.actions.push(action);
        }
    }
    
    // Private methods: underscore prefix
    _validateAction(action) {
        return action && action.type && action.handler;
    }
}

// Object literals: camelCase properties
var configurationObject = {
    serverUrl: 'https://api.example.com',
    timeoutDuration: 30000,
    retryCount: 3,
    enableLogging: true
};
```

### Code Structure

#### Module Pattern
```javascript
// Module pattern for encapsulation
(function(global) {
    'use strict';
    
    // Private variables
    var _moduleState = {};
    var _initialized = false;
    var _eventHandlers = {};
    
    // Private functions
    function _validateInput(input) {
        return input !== null && input !== undefined && input.length > 0;
    }
    
    function _logError(message) {
        if (console && console.error) {
            console.error('[ModuleName] ' + message);
        }
    }
    
    // Public API
    var ModuleName = {
        /**
         * Initialize the module
         * @param {Object} config Configuration options
         */
        init: function(config) {
            if (_initialized) {
                _logError('Module already initialized');
                return false;
            }
            
            _moduleState = config || {};
            _initialized = true;
            return true;
        },
        
        /**
         * Perform main action
         * @param {Object} parameters Action parameters
         * @returns {Object} Result object
         */
        performAction: function(parameters) {
            if (!_initialized) {
                throw new Error('Module not initialized');
            }
            
            if (!_validateInput(parameters.input)) {
                throw new Error('Invalid input parameters');
            }
            
            try {
                // Implementation logic
                var result = this._processInput(parameters.input);
                return {
                    success: true,
                    result: result
                };
            } catch (error) {
                _logError('Action failed: ' + error.message);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * Add event handler
         * @param {string} event Event name
         * @param {Function} handler Event handler function
         */
        on: function(event, handler) {
            if (!_eventHandlers[event]) {
                _eventHandlers[event] = [];
            }
            _eventHandlers[event].push(handler);
        }
    };
    
    // Export to global scope
    global.ModuleName = ModuleName;
    
})(window);
```

#### Function Documentation
```javascript
/**
 * Process user input and generate automation code
 * @param {Object} inputData - Input data object
 * @param {string} inputData.selector - CSS selector for element
 * @param {string} inputData.action - Action to perform
 * @param {Object} inputData.options - Additional options
 * @param {boolean} [inputData.options.waitForElement=true] - Wait for element
 * @param {number} [inputData.options.timeout=5000] - Timeout in milliseconds
 * @returns {string} Generated automation code
 * @throws {Error} When input validation fails
 */
function generateAutomationCode(inputData) {
    // Validate required parameters
    if (!inputData || !inputData.selector || !inputData.action) {
        throw new Error('Missing required parameters: selector and action');
    }
    
    // Set default options
    var options = inputData.options || {};
    options.waitForElement = options.waitForElement !== false;
    options.timeout = options.timeout || 5000;
    
    // Generate code based on action type
    switch (inputData.action) {
        case 'click':
            return generateClickCode(inputData.selector, options);
        case 'type':
            return generateTypeCode(inputData.selector, inputData.text, options);
        default:
            throw new Error('Unsupported action: ' + inputData.action);
    }
}
```

### Error Handling

#### Try-Catch Blocks
```javascript
function executeActionSafely(actionData) {
    try {
        // Validate input
        if (!actionData || !actionData.type) {
            throw new Error('Invalid action data provided');
        }
        
        // Log action start
        console.log('Executing action:', actionData.type);
        
        // Execute action
        var result = performActionByType(actionData.type, actionData.parameters);
        
        // Log success
        console.log('Action completed successfully');
        
        return {
            success: true,
            result: result,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        // Log error with context
        console.error('Action execution failed:', {
            action: actionData ? actionData.type : 'unknown',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}
```

## 🎨 Qt-Specific Guidelines

### Signal-Slot Connections
```cpp
// Prefer new syntax for type safety
connect(button, &QPushButton::clicked, 
        this, &MainWindow::OnButtonClicked);

// Use lambda for simple operations
connect(timer, &QTimer::timeout, [this]() {
    UpdateStatus();
});

// Disconnect when necessary
disconnect(object, &Object::signal, this, &Class::slot);
```

### Resource Management
```cpp
// Use Qt resource system for embedded resources
Q_INIT_RESOURCE(application);

// Access resources
QPixmap icon(":/icons/application.png");
QString stylesheet = QString::fromUtf8(":/styles/main.css");
```

### Internationalization
```cpp
// Use tr() for translatable strings
QString message = tr("Operation completed successfully");
QString error = tr("Failed to load file: %1").arg(filename);

// Use QCoreApplication::translate for static contexts
QString staticMessage = QCoreApplication::translate("Context", "Message");
```

## 📝 Documentation Standards

### Code Comments
```cpp
/**
 * @brief Brief description of the function
 * 
 * Detailed description explaining the purpose,
 * behavior, and any important notes about the function.
 * 
 * @param parameter1 Description of first parameter
 * @param parameter2 Description of second parameter
 * @return Description of return value
 * @throws ExceptionType When this exception is thrown
 * 
 * @see RelatedFunction
 * @since Version 1.2.0
 */
ReturnType FunctionName(Type1 parameter1, Type2 parameter2);

// Inline comments for complex logic
void ComplexFunction() {
    // Step 1: Initialize resources
    InitializeResources();
    
    // Step 2: Process data with error handling
    try {
        ProcessData();
    } catch (const Exception& e) {
        // Log error and continue with fallback
        LogError(e.what());
        UseFallbackMethod();
    }
    
    // Step 3: Cleanup (always executed)
    CleanupResources();
}
```

### File Headers
```cpp
/**
 * @file filename.h
 * @brief Brief description of the file
 * 
 * Detailed description of the file's purpose,
 * the classes it contains, and any important notes.
 * 
 * @author Author Name
 * @date Creation date
 * @version Current version
 */
```

## 📁 File Organization

### Directory Structure
- Group related files in logical directories
- Use consistent naming for directories
- Separate interface definitions from implementations
- Keep test files in dedicated test directories

### File Naming
- Use descriptive names that reflect the file's purpose
- Follow consistent naming patterns within each component
- Use appropriate file extensions (.h/.cpp for C++, .js for JavaScript)

### Include Order
```cpp
// 1. Corresponding header file (for .cpp files)
#include "classname.h"

// 2. System/standard library headers
#include <algorithm>
#include <memory>
#include <vector>

// 3. Qt headers
#include <QApplication>
#include <QDebug>
#include <QString>

// 4. Third-party library headers
#include <curl/curl.h>

// 5. Project headers
#include "iinterface.h"
#include "utility.h"
```

---

*These coding standards ensure consistency and maintainability across the BrowserAutomationStudio codebase.*
