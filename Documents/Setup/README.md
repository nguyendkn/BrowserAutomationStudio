# Hướng Dẫn Cài Đặt và Thiết Lập

Hướng dẫn này cung cấp các chỉ dẫn toàn diện để thiết lập môi trường phát triển BrowserAutomationStudio và build dự án từ source code.

## 📋 Mục Lục

- [Yêu Cầu Tiên Quyết](#yêu-cầu-tiên-quyết)
- [Thiết Lập Môi Trường Phát Triển](#thiết-lập-môi-trường-phát-triển)
- [Build Từ Source Code](#build-từ-source-code)
- [Cấu Hình](#cấu-hình)
- [Khắc Phục Sự Cố](#khắc-phục-sự-cố)

## 🔧 Yêu Cầu Tiên Quyết

### Yêu Cầu Hệ Thống

#### Yêu Cầu Tối Thiểu
- **Hệ Điều Hành**: Windows 10 (64-bit) trở lên
- **RAM**: Tối thiểu 4 GB, khuyến nghị 8 GB
- **Lưu Trữ**: 10 GB dung lượng trống cho môi trường phát triển
- **CPU**: Intel Core i3 hoặc AMD tương đương

#### Yêu Cầu Khuyến Nghị
- **Hệ Điều Hành**: Windows 11 (64-bit)
- **RAM**: 16 GB trở lên
- **Lưu Trữ**: 20 GB dung lượng trống (khuyến nghị SSD)
- **CPU**: Intel Core i5/i7 hoặc AMD Ryzen 5/7

### Phần Mềm Yêu Cầu

#### Công Cụ Phát Triển Cốt Lõi
1. **Visual Studio 2019/2022** (Community Edition trở lên)
   - Workload phát triển C++
   - Windows 10/11 SDK
   - CMake tools cho Visual Studio

2. **Qt Framework 5.15.x**
   - Tải từ [Trang Web Chính Thức Qt](https://www.qt.io/download)
   - Các thành phần yêu cầu:
     - Qt 5.15.x cho MSVC 2019/2022 64-bit
     - Qt Creator (tùy chọn nhưng khuyến nghị)
     - Qt WebEngine

3. **Git for Windows**
   - Tải từ [Trang Web Chính Thức Git](https://git-scm.com/download/win)
   - Yêu cầu cho version control và quản lý dependency

#### Các Dependency Bổ Sung

4. **Node.js 16.x trở lên**
   - Yêu cầu cho phát triển JavaScript và build tools
   - Tải từ [Trang Web Chính Thức Node.js](https://nodejs.org/)

5. **Python 3.8+**
   - Yêu cầu cho một số build script
   - Tải từ [Trang Web Chính Thức Python](https://www.python.org/)

6. **Chromium Embedded Framework (CEF)**
   - Tự động tải xuống trong quá trình build
   - Phiên bản được chỉ định trong cấu hình build

## 🛠️ Thiết Lập Môi Trường Phát Triển

### 1. Clone Repository

```bash
# Clone repository chính
git clone https://gitlab.com/bablosoft/bas.git
cd bas

# Clone repository build
git clone https://gitlab.com/bablosoft/basbuild.git
```

### 2. Biến Môi Trường

Thiết lập các biến môi trường sau:

```batch
# Đường dẫn cài đặt Qt
set QTDIR=C:\Qt\5.15.2\msvc2019_64
set PATH=%QTDIR%\bin;%PATH%

# Visual Studio Tools
set VCINSTALLDIR=C:\Program Files\Microsoft Visual Studio\2022\Community\VC
set VSINSTALLDIR=C:\Program Files\Microsoft Visual Studio\2022\Community

# Cấu hình BAS Build
set BAS_BUILD_LOCATION=C:\BAS_BUILD
set BAS_SOURCE_LOCATION=C:\path\to\bas
```

### 3. Cấu Hình Qt

#### Cài Đặt Các Thành Phần Qt
Đảm bảo các thành phần Qt sau được cài đặt:
- Qt 5.15.x MSVC 2019/2022 64-bit
- Qt WebEngine
- Qt Network Authorization
- Qt Charts (tùy chọn, cho analytics)

#### Cấu Hình Qt Creator (Tùy Chọn)
1. Mở Qt Creator
2. Đi tới Tools → Options → Kits
3. Xác minh rằng MSVC compiler được phát hiện
4. Thiết lập đường dẫn phiên bản Qt
5. Cấu hình kit cho phát triển 64-bit

### 4. Cấu Hình Visual Studio

#### Workload Yêu Cầu
- Desktop development with C++
- Game development with C++ (cho các thư viện bổ sung)

#### Các Thành Phần Riêng Lẻ Yêu Cầu
- MSVC v143 - VS 2022 C++ x64/x86 build tools
- Windows 10/11 SDK (phiên bản mới nhất)
- CMake tools cho Visual Studio
- Git for Windows

## 🔨 Building from Source

### 1. Quick Build (Development)

For JavaScript-only development, use the quick build process:

```batch
# Navigate to build directory
cd basbuild

# Run development build
Development.bat

# This creates a development build in:
# %BAS_BUILD_LOCATION%\build\development\apps\CURRENT_VERSION\
```

### 2. Full Build Process

For complete source compilation:

#### Step 1: Prepare Build Environment
```batch
# Create build directory
mkdir %BAS_BUILD_LOCATION%
cd %BAS_BUILD_LOCATION%

# Initialize build configuration
copy %BAS_SOURCE_LOCATION%\basbuild\config.template.ini config.ini
# Edit config.ini with your specific paths
```

#### Step 2: Download Dependencies
```batch
# Download CEF and other dependencies
cd basbuild
DownloadDependencies.bat
```

#### Step 3: Build Components
```batch
# Build all components
BuildAll.bat

# Or build individual components:
BuildEngine.bat
BuildStudio.bat
BuildChromeWorker.bat
BuildScheduler.bat
```

### 3. Component-Specific Builds

#### Building Engine Component
```batch
cd %BAS_SOURCE_LOCATION%\Solution\Engine
qmake Engine.pro
nmake release
```

#### Building Studio Component
```batch
cd %BAS_SOURCE_LOCATION%\Solution\Studio
qmake Studio.pro
nmake release
```

#### Building ChromeWorker Component
```batch
cd %BAS_SOURCE_LOCATION%\Solution\ChromeWorker
qmake ChromeWorker.pro
nmake release
```

### 4. Module Development Build

For module development:

```batch
# Build specific module
cd %BAS_SOURCE_LOCATION%\Solution\Modules\YourModule
# Follow module-specific build instructions
```

## ⚙️ Configuration

### 1. Development Configuration

#### config.ini Example
```ini
[Paths]
QtPath=C:\Qt\5.15.2\msvc2019_64
VSPath=C:\Program Files\Microsoft Visual Studio\2022\Community
CEFPath=%BAS_BUILD_LOCATION%\dependencies\cef
BuildOutput=%BAS_BUILD_LOCATION%\build

[Build]
Configuration=Debug
Platform=x64
Parallel=true
MaxConcurrency=4

[Features]
EnableWebDriver=true
EnableScheduler=true
EnableModules=true
```

#### Qt Configuration File
Create `qt.conf` in the application directory:
```ini
[Paths]
Prefix = .
Binaries = .
Libraries = .
Plugins = plugins
```

### 2. Runtime Configuration

#### Application Settings
The application uses QSettings for configuration:
- **Windows**: Registry under `HKEY_CURRENT_USER\Software\BrowserAutomationStudio`
- **Configuration File**: `settings.ini` in application directory

#### Database Configuration
```ini
[Database]
Type=SQLite
Path=data/database.db
ConnectionTimeout=30000
```

#### Logging Configuration
```ini
[Logging]
Level=Info
OutputFile=logs/application.log
MaxFileSize=10MB
MaxFiles=5
```

## 🔍 Troubleshooting

### Common Build Issues

#### Qt Not Found
**Error**: `Qt installation not found`
**Solution**:
1. Verify QTDIR environment variable
2. Check Qt installation path
3. Ensure Qt 5.15.x is installed with MSVC compiler

#### CEF Download Failure
**Error**: `Failed to download CEF`
**Solution**:
1. Check internet connection
2. Verify proxy settings
3. Manually download CEF from build configuration

#### Compilation Errors
**Error**: Various C++ compilation errors
**Solution**:
1. Ensure Visual Studio 2019/2022 is installed
2. Check Windows SDK version
3. Verify all dependencies are available

### Runtime Issues

#### Application Won't Start
**Symptoms**: Application crashes on startup
**Solutions**:
1. Check Qt DLL dependencies
2. Verify CEF binaries are present
3. Check application permissions
4. Review error logs

#### Module Loading Failures
**Symptoms**: Modules not appearing in interface
**Solutions**:
1. Check module manifest files
2. Verify module dependencies
3. Check file permissions
4. Review module logs

#### Browser Automation Issues
**Symptoms**: Browser operations fail
**Solutions**:
1. Check CEF initialization
2. Verify browser permissions
3. Check for antivirus interference
4. Review browser logs

### Performance Optimization

#### Build Performance
- Use SSD for build directory
- Increase RAM allocation
- Use parallel compilation
- Close unnecessary applications

#### Runtime Performance
- Allocate sufficient RAM
- Use dedicated graphics card
- Optimize script complexity
- Monitor resource usage

### Getting Help

#### Documentation Resources
- [BAS Build Repository](https://gitlab.com/bablosoft/basbuild)
- [Issue Tracker](https://gitlab.com/bablosoft/bas/-/issues)
- [Community Forums](https://bablosoft.com/forum)

#### Reporting Issues
When reporting build issues, include:
1. Operating system version
2. Visual Studio version
3. Qt version
4. Complete error messages
5. Build configuration details

---

*For development guidelines and best practices, see the [Development Guide](../Development/README.md)*
