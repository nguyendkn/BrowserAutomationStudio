# Component Documentation

This section provides detailed documentation for each major component in the BrowserAutomationStudio system.

## 📋 Table of Contents

- [Studio Component](#studio-component)
- [Engine Component](#engine-component)
- [ChromeWorker Component](#chromeworker-component)
- [Scheduler Component](#scheduler-component)
- [Module System](#module-system)
- [Supporting Components](#supporting-components)

## 🎨 Studio Component

**Location**: `Solution/Studio/`
**Purpose**: Main IDE and project management interface

### Key Features
- Visual script editor with drag-and-drop interface
- Project management and file operations
- Module installation and management
- Database administration tools
- HTTP traffic monitoring and analysis

### Core Classes

#### MainWindow
**File**: `mainwindow.h/cpp`
**Purpose**: Primary application window and orchestrator

<augment_code_snippet path="Solution/Studio/mainwindow.h" mode="EXCERPT">
````cpp
class MainWindow : public QMainWindow
{
    Q_OBJECT

private:
    IBrowserFactory *BrowserFactory;
    ISolverFactory *FactorySolver;
    Resources *Res;
    QSettings *Settings;
    QtResourceController *WidgetController;
    EngineResources *EngineRes;
    IMultiWorker * Worker;
    DatabaseAdmin *_DatabaseAdmin;
    ModuleManager *_ModuleManager;
````
</augment_code_snippet>

**Key Responsibilities**:
- Application lifecycle management
- UI component coordination
- Resource and worker management
- Module system integration

#### Compiler
**File**: `compiler.h/cpp`
**Purpose**: Script compilation and validation

**Key Methods**:
- `Compile()`: Compiles scripts for execution
- `Validate()`: Validates script syntax and structure
- `GetErrors()`: Returns compilation errors

#### ModuleManager Integration
**File**: `modulemanager.h/cpp`
**Purpose**: Plugin management interface

**Features**:
- Module discovery and loading
- Dependency resolution
- Version management
- Installation/uninstallation

### User Interface Components

#### Database Administration
- **DatabaseAdmin**: Complete database management interface
- **DatabaseConnectionDialog**: Database connection configuration
- **DatabaseSchemaEditor**: Schema design and modification

#### HTTP Sniffer
- **HttpSniffer**: Network traffic monitoring
- **Request/Response analysis**: Detailed HTTP inspection
- **Traffic filtering**: Advanced filtering capabilities

## ⚙️ Engine Component

**Location**: `Solution/Engine/`
**Purpose**: Core automation framework and runtime

### Architecture Overview
The Engine component implements a comprehensive framework for browser automation with:
- Multi-threaded execution
- Resource management
- Plugin system
- Database integration
- Network services

### Core Interfaces

#### IMultiWorker
**Purpose**: Multi-threaded script execution interface

<augment_code_snippet path="Solution/Engine/imultiworker.h" mode="EXCERPT">
````cpp
class IMultiWorker : public QObject
{
    Q_OBJECT
public:
    virtual void SetLogger(ILogger *Logger) = 0;
    virtual void SetBrowserFactory(IBrowserFactory *BrowserFactory) = 0;
    virtual void SetResourceController(IResourceController *ResourceController) = 0;
    virtual void Start() = 0;
    virtual void Stop() = 0;
````
</augment_code_snippet>

#### IBrowser
**Purpose**: Browser abstraction layer

**Key Methods**:
- `LoadUrl()`: Navigate to URL
- `ExecuteScript()`: Execute JavaScript
- `GetElement()`: DOM element access
- `TakeScreenshot()`: Capture browser state

#### IResourceController
**Purpose**: Resource management interface

**Features**:
- String resources (files, databases, URLs)
- Integer resources (fixed, random ranges)
- Database resources with filtering
- Resource caching and optimization

### Key Implementations

#### ScriptMultiWorker
**File**: `scriptmultiworker.h/cpp`
**Purpose**: Multi-threaded script execution engine

<augment_code_snippet path="Solution/Engine/scriptmultiworker.h" mode="EXCERPT">
````cpp
class ScriptMultiWorker : public IMultiWorker
{
    Q_OBJECT
    
    SubstageManager Substages;
    QTimer *StageTimeoutTimer;
    IBrowserFactory *BrowserFactory;
    ILogger *Logger;
    IResourceController *ResourceController;
````
</augment_code_snippet>

**Features**:
- Parallel script execution
- Resource sharing between workers
- Error handling and recovery
- Performance monitoring

#### Resources System
**File**: `resources.h/cpp`
**Purpose**: Comprehensive resource management

**Resource Types**:
- **Fixed String**: Static string values
- **Random String**: Generated string patterns
- **File Resources**: File-based data sources
- **Database Resources**: SQL-based data sources
- **URL Resources**: HTTP-based data sources

## 🌐 ChromeWorker Component

**Location**: `Solution/ChromeWorker/`
**Purpose**: Browser automation agent using CEF

### Architecture
ChromeWorker implements a sophisticated browser automation system using the Chromium Embedded Framework (CEF) with multiple specialized handlers.

### Core Classes

#### MainApp
**File**: `mainapp.h/cpp`
**Purpose**: CEF application entry point and coordinator

<augment_code_snippet path="Solution/ChromeWorker/mainapp.h" mode="EXCERPT">
````cpp
class MainApp : public CefApp, public CefBrowserProcessHandler
{
    CefRefPtr<ToolboxHandler> thandler;
    CefRefPtr<ScenarioHandler> shandler;
    CefRefPtr<DetectorHandler> detecthandler;
    CefRefPtr<CentralHandler> chandler;
    CefRefPtr<CefBrowser> BrowserToolbox;
    CefRefPtr<CefBrowser> BrowserScenario;
````
</augment_code_snippet>

**Key Features**:
- Multiple browser instance management
- Handler coordination
- IPC communication setup
- Resource management

#### Handler System
The ChromeWorker uses specialized handlers for different aspects:

**MainHandler**: Primary browser event handling
- Page navigation and loading
- JavaScript execution
- DOM manipulation
- Event capture and processing

**V8Handler**: JavaScript bridge implementation
- Native function exposure to JavaScript
- Data exchange between C++ and JavaScript
- Custom API implementation

**DevToolsHandler**: Developer tools integration
- Debugging interface
- Network monitoring
- Performance analysis

### Browser Automation Features

#### Element Interaction
**File**: `elementcommand.h/cpp`
**Purpose**: DOM element manipulation

**Supported Operations**:
- Click, type, select operations
- Element detection and waiting
- Attribute and text extraction
- Form submission and interaction

#### Event Simulation
**File**: `browsereventsemulator.h/cpp`
**Purpose**: Realistic user interaction simulation

**Features**:
- Mouse movement and clicking
- Keyboard input simulation
- Touch and gesture events
- Timing and randomization

### JavaScript Integration

#### Frontend Architecture
**Location**: `Solution/ChromeWorker/html/`

**Scenario Editor** (`scenario/`):
- Backbone.js-based MVC architecture
- Drag-and-drop script building
- Real-time validation and preview
- Undo/redo functionality

**Toolbox Interface** (`toolbox/`):
- Action library and browser
- Module integration interface
- Resource configuration tools
- Help and documentation system

## 📅 Scheduler Component

**Location**: `Solution/Scheduler/`
**Purpose**: Task scheduling and execution management

### Core Features
- Cron-like scheduling syntax
- Task queue management
- Execution monitoring
- REST API interface
- System service integration

### Key Classes

#### TaskManager
**File**: `taskmanager.h/cpp`
**Purpose**: Task lifecycle management

**Features**:
- Task creation and configuration
- Schedule parsing and validation
- Execution history tracking
- Resource allocation

#### RunManager
**File**: `runmanager.h/cpp`
**Purpose**: Execution coordination

**Responsibilities**:
- Worker process management
- Resource distribution
- Progress monitoring
- Error handling and recovery

#### WebApplication
**File**: `webapplication.h/cpp`
**Purpose**: HTTP API interface

**API Endpoints**:
- `/tasks/` - Task management
- `/schedule/` - Schedule operations
- `/status/` - System status
- `/logs/` - Execution logs

## 🔌 Module System

**Location**: `Solution/Modules/`
**Purpose**: Extensible plugin architecture

### Module Categories

#### Data Processing Modules
- **Archive**: ZIP, RAR, 7Z archive operations
- **JSON**: JSON parsing and manipulation
- **String**: String processing and manipulation
- **Checksum**: Hash and checksum calculations
- **Excel**: Excel file operations

#### Web Interaction Modules
- **Xpath**: XML/HTML parsing with XPath
- **RegularExpression**: Pattern matching and extraction
- **URL**: URL manipulation and validation
- **HCaptcha/ReCaptcha**: CAPTCHA solving integration

#### System Integration Modules
- **FileSystem**: File and directory operations
- **Database**: Direct database access
- **Processes**: System process management
- **Clipboard**: System clipboard integration

### Module Structure

#### Manifest Definition
**File**: `manifest.json`
**Purpose**: Module metadata and action definitions

<augment_code_snippet path="Solution/Modules/Archive/js/manifest.json" mode="EXCERPT">
````json
{
    "name": "Archive",
    "description": "Working with archives",
    "api_version": 1,
    "actions": [
        {
            "name": "Archive_Unpack",
            "description": {
                "en": "Unpack archive",
                "ru": "Распаковать архив"
            },
            "interface": "Archive_Unpack_interface.js",
            "code": [{"file": "Archive_Unpack_code.js"}]
        }
    ]
}
````
</augment_code_snippet>

#### Action Implementation
Each module action consists of:
- **Interface**: UI definition for parameter input
- **Code**: JavaScript implementation
- **Select**: Validation and code generation

## 🛠️ Supporting Components

### Updater Component
**Location**: `Solution/Updater/`
**Purpose**: Application update management

**Features**:
- Automatic update checking
- Delta updates for efficiency
- Rollback capabilities
- Silent and interactive modes

### FastExecuteScript
**Location**: `Solution/FastExecuteScript/`
**Purpose**: Quick script execution utility

**Use Cases**:
- Command-line script execution
- Batch processing
- Integration with external systems
- Testing and debugging

### RemoteExecuteScript
**Location**: `Solution/RemoteExecuteScript/`
**Purpose**: Remote script execution capabilities

**Features**:
- HTTP-based script submission
- Remote resource access
- Distributed execution
- Cloud integration support

---

*For implementation details and examples, see the [API Reference](../API/README.md)*
