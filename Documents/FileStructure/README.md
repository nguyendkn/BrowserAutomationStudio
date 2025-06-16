# File Structure Documentation

This document provides a comprehensive overview of the BrowserAutomationStudio project file structure, explaining the purpose and organization of each directory and key files.

## 📋 Table of Contents

- [Project Root](#project-root)
- [Solution Directory](#solution-directory)
- [Component Breakdown](#component-breakdown)
- [Build System](#build-system)
- [Configuration Files](#configuration-files)
- [Documentation Structure](#documentation-structure)

## 📁 Project Root

```
BrowserAutomationStudio/
├── Documents/                   # Project documentation (this documentation)
├── README.md                   # Main project README
└── Solution/                   # Main source code directory
```

### Key Files

- **README.md**: Main project documentation with build instructions and contribution guidelines
- **Documents/**: Comprehensive documentation structure created for the project

## 🏗️ Solution Directory

The `Solution/` directory contains all source code organized by component:

```
Solution/
├── Solution.pro               # Main Qt project file
├── Studio/                   # Main IDE application
├── Engine/                   # Core automation framework
├── ChromeWorker/            # Browser automation agent
├── Scheduler/               # Task scheduling system
├── SchedulerBrowser/        # Scheduler web interface
├── Modules/                 # Plugin modules
├── FastExecuteScript/       # Quick script execution utility
├── RemoteExecuteScript/     # Remote execution component
├── Updater/                 # Application updater
├── WebInterfaceBrowser/     # Web interface browser
├── ShopViewer/              # Shop/marketplace viewer
└── Tests/                   # Test suites
```

## 🔧 Component Breakdown

### Studio Component
**Location**: `Solution/Studio/`
**Purpose**: Main IDE and project management interface

```
Studio/
├── Studio.pro              # Qt project file
├── main.cpp                # Application entry point
├── mainwindow.h/cpp        # Main window implementation
├── mainwindow.ui           # UI layout file
├── compiler.h/cpp          # Script compiler
├── httpsniffer.h/cpp       # HTTP traffic monitoring
├── databasestatedialog.*   # Database management UI
├── uploadproject.*         # Project upload functionality
├── downloadprojectdialog.* # Project download functionality
├── recentswidget.*         # Recent projects widget
├── singleapplication.*     # Single instance management
├── studio.qrc              # Qt resource file
├── images/                 # UI images and icons
├── data/                   # Application data files
├── translate/              # Translation files
└── debug_memory/           # Memory debugging utilities
```

### Engine Component
**Location**: `Solution/Engine/`
**Purpose**: Core automation framework and runtime

```
Engine/
├── Engine.pro              # Qt project file
├── engine.h/cpp            # Main engine class
├── engine_global.h         # Global definitions
├── engine.qrc              # Qt resource file
│
├── Core Interfaces/
│   ├── imultiworker.h/cpp      # Multi-worker interface
│   ├── ibrowser.h/cpp          # Browser abstraction
│   ├── iresourcecontroller.*   # Resource management
│   ├── imodulemanager.*        # Module system
│   └── ...                     # Other core interfaces
│
├── Implementations/
│   ├── scriptmultiworker.*     # Script execution engine
│   ├── resources.*             # Resource management
│   ├── modulemanager.*         # Module system
│   ├── databasestate.*         # Database integration
│   └── ...                     # Other implementations
│
├── UI Components/
│   ├── databaseadmin.*         # Database administration
│   ├── modulemanagerwindow.*   # Module management UI
│   ├── resourcewizard.*        # Resource creation wizard
│   ├── outputwidget.*          # Output display
│   └── ...                     # Other UI components
│
├── Utilities/
│   ├── translator.*            # Internationalization
│   ├── versioninfo.*           # Version management
│   ├── filelogger.*            # File logging
│   ├── csvhelper.*             # CSV processing
│   └── ...                     # Other utilities
│
├── External Libraries/
│   ├── accordion/              # Accordion UI component
│   ├── diff/                   # Diff/patch utilities
│   ├── snappy/                 # Compression library
│   ├── zip/                    # ZIP archive support
│   ├── oauth/                  # OAuth authentication
│   ├── mail/                   # Email functionality
│   └── text/                   # Text processing
│
├── themes/                 # UI themes
├── images/                 # Engine images and icons
├── scripts/                # Utility scripts
└── translate/              # Translation files
```

### ChromeWorker Component
**Location**: `Solution/ChromeWorker/`
**Purpose**: Browser automation agent using CEF

```
ChromeWorker/
├── ChromeWorker.pro        # Qt project file
├── main.cpp                # Application entry point
├── main.rc                 # Windows resource file
├── Logo.ico                # Application icon
│
├── Core Classes/
│   ├── mainapp.h/cpp           # CEF application
│   ├── mainhandler.h/cpp       # Browser event handler
│   ├── centralhandler.*        # Central coordination
│   ├── v8handler.*             # JavaScript bridge
│   ├── elementcommand.*        # DOM interaction
│   └── browserdata.*           # Browser state
│
├── Handlers/
│   ├── toolboxhandler.*        # Toolbox interface handler
│   ├── scenariohandler.*       # Scenario editor handler
│   ├── detectorhandler.*       # Element detector handler
│   ├── devtoolshandler.*       # DevTools integration
│   └── resourcehandler.*       # Resource handling
│
├── V8 Handlers/
│   ├── toolboxv8handler.*      # Toolbox JavaScript API
│   ├── scenariov8handler.*     # Scenario JavaScript API
│   ├── centralv8handler.*      # Central JavaScript API
│   ├── detectorv8handler.*     # Detector JavaScript API
│   └── interprocessv8handler.* # IPC JavaScript API
│
├── Utilities/
│   ├── browsereventsemulator.* # Event simulation
│   ├── fingerprintdetector.*   # Browser fingerprinting
│   ├── cookievisitor.*         # Cookie management
│   ├── languagemanager.*       # Language support
│   └── ...                     # Other utilities
│
├── HTML Frontend/
│   ├── scenario/               # Scenario editor interface
│   ├── toolbox/                # Action toolbox interface
│   ├── detector/               # Element detector interface
│   ├── central/                # Central control interface
│   ├── scheduler/              # Scheduler interface
│   ├── menu/                   # Context menu interface
│   ├── actions/                # Action definitions
│   ├── main/                   # Shared utilities
│   ├── fonts/                  # Web fonts
│   └── icons/                  # UI icons
│
├── connector/              # External connectors
├── json/                   # JSON utilities
├── png/                    # PNG image processing
├── snappy/                 # Compression support
├── tooltip/                # Tooltip system
├── xml/                    # XML processing
└── *.bmp, *.cur           # UI resources
```

### Scheduler Component
**Location**: `Solution/Scheduler/`
**Purpose**: Task scheduling and execution management

```
Scheduler/
├── Scheduler.pro           # Qt project file
├── main.cpp                # Application entry point
│
├── Core Classes/
│   ├── taskmanager.*           # Task lifecycle management
│   ├── runmanager.*            # Execution coordination
│   ├── task.*                  # Task definition
│   ├── taskpersist.*           # Task persistence
│   └── schedulepredict.*       # Schedule prediction
│
├── API/
│   ├── apiexternal.*           # External API
│   ├── apiscript.*             # Script API
│   ├── webapplication.*        # Web application
│   └── stream.*                # Data streaming
│
├── HTTP Server/
│   └── httpserver/             # HTTP server implementation
│
├── Utilities/
│   ├── schedulerinstaller.*    # System service installation
│   ├── logger.*                # Logging system
│   └── manualactions.*         # Manual action handling
```

### Modules Directory
**Location**: `Solution/Modules/`
**Purpose**: Extensible plugin system

```
Modules/
├── Archive/                # Archive operations (ZIP, RAR, 7Z)
├── CaptchaCommon/         # Common CAPTCHA solving code
├── Checksum/              # Hash and checksum calculations
├── ClickCaptcha/          # Click-based CAPTCHA solving
├── Clipboard/             # System clipboard integration
├── CommonCode/            # Shared module code
├── CurlWrapper/           # HTTP client wrapper
├── Database/              # Database operations
├── DateTime/              # Date and time utilities
├── EmbeddedLanguages/     # Embedded language support
├── Excel/                 # Excel file operations
├── FTP/                   # FTP client functionality
├── FileSystem/            # File system operations
├── FingerprintSwitcher/   # Browser fingerprint switching
├── FontPack/              # Font management
├── FunCaptcha/            # FunCaptcha solving
├── FunctionAsyncCall/     # Asynchronous function calls
├── HCaptcha/              # hCaptcha solving
├── IdleEmulation/         # Idle behavior emulation
├── ImageProcessing/       # Image manipulation
├── InMail/                # Email processing
├── JSON/                  # JSON manipulation
├── List/                  # List operations
├── MailDeprecated/        # Legacy email functionality
├── Path/                  # Path utilities
├── PhoneVerification/     # Phone number verification
├── Processes/             # Process management
├── Profiles/              # Browser profile management
├── ReCaptcha/             # reCAPTCHA solving
├── RegularExpression/     # Regular expression utilities
├── Resources/             # Resource management
├── SQL/                   # SQL operations
├── ScriptStats/           # Script statistics
├── SmsReceive/            # SMS receiving
├── SmtpClient/            # SMTP email client
├── String/                # String manipulation
├── Telegram/              # Telegram integration
├── Timezones/             # Timezone handling
├── URL/                   # URL utilities
├── UserNotification/      # User notifications
└── Xpath/                 # XPath processing
```

#### Module Structure Example
```
ModuleName/
├── js/                     # JavaScript implementation
│   ├── manifest.json           # Module metadata
│   ├── action_interface.js     # UI interface
│   ├── action_select.js        # Code generation
│   ├── action_code.js          # Implementation
│   └── localization/           # Translations
├── cpp/                    # Native extensions (optional)
│   ├── module.h/cpp            # C++ implementation
│   └── CMakeLists.txt          # Build configuration
├── resources/              # Static resources
│   ├── icons/                  # Module icons
│   └── images/                 # UI images
└── tests/                  # Module tests
```

### Supporting Components

#### FastExecuteScript
**Location**: `Solution/FastExecuteScript/`
```
FastExecuteScript/
├── FastExecuteScript.pro   # Qt project file
├── main.cpp                # Application entry point
├── mainwindow.*            # Main window
├── execute.qrc             # Resources
├── images/                 # UI images
└── translate/              # Translations
```

#### Updater
**Location**: `Solution/Updater/`
```
Updater/
├── Updater.pro             # Qt project file
├── main.cpp                # Application entry point
├── updater.*               # Update logic
├── downloadingwidget.*     # Download UI
├── checkforupdateswidget.* # Update check UI
├── newversionwidget.*      # New version UI
├── updateprogress.*        # Progress UI
├── httpclient.*            # HTTP client
├── resumedownloader.*      # Resume download
├── oldversionremover.*     # Cleanup utility
├── zip/                    # ZIP support
└── images/                 # UI images
```

#### Tests
**Location**: `Solution/Tests/`
```
Tests/
├── unit/                   # Unit tests
│   ├── engine/                 # Engine component tests
│   ├── studio/                 # Studio component tests
│   └── modules/                # Module tests
└── integration/            # Integration tests
    ├── browser/                # Browser integration tests
    ├── scheduler/              # Scheduler integration tests
    └── end-to-end/             # End-to-end tests
```

## 🔨 Build System

### Qt Project Files
- **Solution.pro**: Main project file defining subdirectories
- **Component.pro**: Individual component project files
- **qmake**: Qt's build system for cross-platform compilation

### Build Configuration
```
# Solution.pro structure
TEMPLATE = subdirs
SUBDIRS += \
    Studio \
    Engine \
    FastExecuteScript \
    Updater \
    RemoteExecuteScript \
    ShopViewer
```

### Resource Files
- **\*.qrc**: Qt resource files containing embedded resources
- **\*.ui**: Qt Designer UI layout files
- **\*.rc**: Windows resource files

## ⚙️ Configuration Files

### Application Configuration
- **settings.ini**: Application settings and preferences
- **qt.conf**: Qt framework configuration
- **config.ini**: Build configuration (in build directory)

### Module Configuration
- **manifest.json**: Module metadata and action definitions
- **localization files**: Translation resources

### Database Configuration
- **schema files**: Database schema definitions
- **migration scripts**: Database update scripts

## 📚 Documentation Structure

### Generated Documentation
```
Documents/
├── README.md               # Main documentation entry point
├── Architecture/           # System architecture documentation
│   └── README.md
├── Components/             # Component-specific documentation
│   └── README.md
├── API/                    # API reference documentation
│   └── README.md
├── Setup/                  # Installation and setup guides
│   └── README.md
├── Development/            # Development guidelines
│   ├── README.md
│   └── CONTRIBUTING.md
├── Modules/                # Module development guide
│   └── README.md
├── FileStructure/          # This file structure documentation
│   └── README.md
├── CodingStandards/        # Code style and standards
│   └── README.md
├── Testing/                # Testing guidelines
│   └── README.md
├── UserGuide/              # End-user documentation
│   └── README.md
├── Tutorials/              # Step-by-step tutorials
│   └── README.md
└── Examples/               # Code examples and use cases
    └── README.md
```

### Documentation Standards
- **Markdown format**: All documentation uses Markdown
- **Structured organization**: Logical hierarchy and cross-references
- **Code examples**: Comprehensive code samples
- **Diagrams**: Mermaid diagrams for architecture visualization
- **Multilingual support**: English primary, Russian secondary

---

*This file structure documentation is part of the comprehensive BrowserAutomationStudio documentation suite.*
