# Phân Tích Hệ Thống Profile Management

Tài liệu này cung cấp phân tích chi tiết về hệ thống quản lý profile trong BrowserAutomationStudio, bao gồm profile isolation, session management và security features.

## 📋 Mục Lục

- [Tổng Quan Profile System](#tổng-quan-profile-system)
- [Kiến Trúc Profile Management](#kiến-trúc-profile-management)
- [Profile Lifecycle](#profile-lifecycle)
- [Profile Isolation](#profile-isolation)
- [Session Management](#session-management)
- [Profile Security](#profile-security)
- [Performance Optimization](#performance-optimization)

## 🔍 Tổng Quan Profile System

### Kiến Trúc Tổng Thể

```mermaid
graph TB
    subgraph "Profile Management Layer"
        PM[Profile Manager]
        PS[Profile Storage]
        PL[Profile Loader]
        PC[Profile Cache]
    end
    
    subgraph "Profile Types"
        LP[Local Profiles]
        TP[Temporary Profiles]
        OP[Online Profiles (MLA)]
        IP[Incognito Profiles]
    end
    
    subgraph "Profile Components"
        FP[Fingerprint Data]
        PD[Proxy Data]
        CD[Cookie Data]
        LS[Local Storage]
        SS[Session Storage]
        CF[Cache Files]
    end
    
    subgraph "Security Layer"
        PLS[Profile Lock System]
        PE[Profile Encryption]
        PA[Profile Access Control]
        PI[Profile Isolation]
    end
    
    PM --> LP
    PM --> TP
    PM --> OP
    PM --> IP
    
    LP --> FP
    LP --> PD
    LP --> CD
    LP --> LS
    LP --> SS
    LP --> CF
    
    PM --> PLS
    PM --> PE
    PM --> PA
    PM --> PI
    
    PS --> PC
    PL --> PC
```

### Core Profile Manager

```cpp
class ProfileManager {
private:
    struct ProfileContext {
        QString profileId;
        QString profilePath;
        ProfileType type;
        QDateTime createdAt;
        QDateTime lastUsed;
        bool isLocked;
        bool isActive;
        QHash<QString, QVariant> metadata;
        std::unique_ptr<ProfileSecurity> security;
    };
    
    QHash<QString, ProfileContext> _profiles;
    QMutex _profileMutex;
    ProfileCache* _cache;
    ProfileSecurity* _security;
    
public:
    ProfileManager() {
        _cache = new ProfileCache(this);
        _security = new ProfileSecurity(this);
        InitializeProfileSystem();
    }
    
    QString CreateProfile(const ProfileConfig& config);
    bool LoadProfile(const QString& profileId);
    bool SwitchProfile(const QString& profileId);
    void SaveProfile(const QString& profileId);
    void RemoveProfile(const QString& profileId);
    
private:
    void InitializeProfileSystem();
    bool ValidateProfilePath(const QString& path);
    void SetupProfileIsolation(const QString& profileId);
    void CleanupProfile(const QString& profileId);
};
```

## 🏗️ Kiến Trúc Profile Management

### Profile Switching Implementation

<augment_code_snippet path="Solution/Modules/Profiles/js/use_profile_code.js" mode="EXCERPT">
````javascript
ProfilePath = (<%= profile %>);

_do(function(){
    if(ProfilePath == _get_profile())
        _break();
        
    if(_iterator() > 30)
        fail(tr("Timeout during switching to profile ") + ProfilePath);
    
    // Remove lock file to ensure profile is available
    native("filesystem", "removefile", ProfilePath + "/lockfile");

    if(!JSON.parse(native("filesystem", "fileinfo", ProfilePath + "/lockfile"))["exists"])
        _break();

    sleep(1000)!
})!

// Set profile parameters
var Params = {};
Params["ProfilePath"] = ProfilePath
Params["LoadFingerprintFromProfileFolder"] = (<%= load_fp %>)
_settings(Params)!
````
</augment_code_snippet>

### Profile Data Loading

```javascript
// Load Proxy Configuration
_if(<%= load_proxy %> == "true", function(){
    var is_error = false;
    try {
        _ARG = JSON.parse(native("filesystem", "readfile", JSON.stringify({
            value: (<%= profile %>) + "/proxy.txt",
            base64: false,
            from: 0,
            to: 0
        })))
        _ARG = proxy_pack(_ARG)
    } catch(e) {
        is_error = true
    }
    
    _if(!is_error, function(){
        _set_proxy_for_next_profile(_ARG)!
    })!
})!

// Load Fingerprint Configuration
_if(<%= load_fp %> == "true", function(){
    FINGERPRINT_JSON = native("filesystem", "readfile", JSON.stringify({
        value: (<%= profile %>) + "/fingerprint.json",
        base64: false,
        from: 0,
        to: 0
    }))
    
    _if(FINGERPRINT_JSON.length > 0, function(){
        FINGERPRINT_JSON = JSON.parse(FINGERPRINT_JSON)
        _call(BrowserAutomationStudio_ApplyFingerprint,[
            FINGERPRINT_JSON["fingerprint"],
            FINGERPRINT_JSON["canvas"],
            FINGERPRINT_JSON["webgl"],
            FINGERPRINT_JSON["audio"],
            FINGERPRINT_JSON["battery"],
            FINGERPRINT_JSON["rectangles"],
            FINGERPRINT_JSON["perfectcanvas"],
            FINGERPRINT_JSON["sensor"],
            FINGERPRINT_JSON["font_data"],
            FINGERPRINT_JSON["device_scale"]
        ])!
        sleep(1000)!
    })!
})!
```

### Profile Storage Structure

```
Profile Directory Structure:
├── profile_folder/
│   ├── lockfile                    # Profile lock mechanism
│   ├── fingerprint.json           # Browser fingerprint data
│   ├── performance.json           # Performance fingerprint
│   ├── proxy.txt                  # Proxy configuration
│   ├── cookies/                   # Cookie storage
│   │   ├── Cookies                # Chrome cookie database
│   │   └── Cookies-journal        # Cookie journal
│   ├── Local Storage/             # Local storage data
│   ├── Session Storage/           # Session storage data
│   ├── Cache/                     # Browser cache
│   ├── Extensions/                # Browser extensions
│   ├── User Data/                 # User preferences
│   └── Security/                  # Security certificates
```

## 🔄 Profile Lifecycle

### Profile Creation Process

```cpp
class ProfileCreator {
private:
    QString _profileBasePath;
    ProfileTemplate _defaultTemplate;
    
public:
    QString CreateProfile(const ProfileConfig& config) {
        // Generate unique profile ID
        QString profileId = GenerateProfileId();
        QString profilePath = GetProfilePath(profileId);
        
        // Create profile directory structure
        CreateProfileDirectories(profilePath);
        
        // Initialize profile with template
        InitializeProfileFromTemplate(profilePath, config.templateId);
        
        // Setup security
        SetupProfileSecurity(profilePath, config.securityLevel);
        
        // Create lock file mechanism
        SetupProfileLocking(profilePath);
        
        // Register profile
        RegisterProfile(profileId, profilePath, config);
        
        return profileId;
    }
    
private:
    void CreateProfileDirectories(const QString& profilePath) {
        QDir profileDir(profilePath);
        profileDir.mkpath(".");
        profileDir.mkpath("cookies");
        profileDir.mkpath("Local Storage");
        profileDir.mkpath("Session Storage");
        profileDir.mkpath("Cache");
        profileDir.mkpath("Extensions");
        profileDir.mkpath("User Data");
        profileDir.mkpath("Security");
    }
    
    void InitializeProfileFromTemplate(const QString& profilePath, const QString& templateId) {
        ProfileTemplate tmpl = LoadTemplate(templateId);
        
        // Copy template files
        for (const auto& file : tmpl.files) {
            QString sourcePath = GetTemplatePath(templateId) + "/" + file;
            QString destPath = profilePath + "/" + file;
            QFile::copy(sourcePath, destPath);
        }
        
        // Apply template configuration
        ApplyTemplateConfig(profilePath, tmpl.config);
    }
};
```

### Profile Switching Mechanism

<augment_code_snippet path="Solution/Engine/workersettings.cpp" mode="EXCERPT">
````cpp
if(object.contains("ProfilePath")) {
    QString prev = GetProfile();
    QString next = object["ProfilePath"].toString();
    bool IsNewTempProfile = false;
    
    if(next == QString("<Incognito>")) {
        next.clear();
        TempProfile = QString("prof/") + GetRandomString();
        IsNewTempProfile = true;
    }

    if(prev != next || IsNewTempProfile || (prev.isEmpty() && next.isEmpty() && IsMLA)) {
        if(IsMLAReal) {
            NeedRestart = true;
        } else if(IsMLAVirtual) {
            NeedToRestartVirtual = true;
        } else {
            NeedRestart = true;
        }
        SetProfile(next);
    }
}
````
</augment_code_snippet>

### Profile Cleanup Process

<augment_code_snippet path="Solution/Modules/Profiles/js/remove_local_profile_code.js" mode="EXCERPT">
````javascript
ProfilePath = (<%= profile %>);
if(ProfilePath == "")
    ProfilePath = _get_profile()

_if(ProfilePath == _get_profile(), function(){
    var Params = {};
    Params["ProfilePath"] = "<Incognito>"
    _settings(Params)!
})!

_do(function(){
    if(_iterator() > 30)
        fail(tr("Timeout during deleting profile ") + ProfilePath);
    
    native("filesystem", "removefile", ProfilePath + "/lockfile");

    if(!JSON.parse(native("filesystem", "fileinfo", ProfilePath + "/lockfile"))["exists"])
        _break();

    sleep(1000)!
})!

native("filesystem", "removefile", ProfilePath)
````
</augment_code_snippet>

## 🔒 Profile Isolation

### Process Isolation

```cpp
class ProfileIsolationManager {
private:
    struct IsolationContext {
        QString profileId;
        QProcess* browserProcess;
        QString tempDirectory;
        QStringList isolatedPaths;
        SecurityLevel securityLevel;
    };
    
    QHash<QString, IsolationContext> _isolationContexts;
    
public:
    void SetupProfileIsolation(const QString& profileId, SecurityLevel level) {
        IsolationContext context;
        context.profileId = profileId;
        context.securityLevel = level;
        
        // Create isolated temporary directory
        context.tempDirectory = CreateIsolatedTempDir(profileId);
        
        // Setup isolated paths
        SetupIsolatedPaths(context);
        
        // Configure process isolation
        SetupProcessIsolation(context);
        
        _isolationContexts.insert(profileId, context);
    }
    
private:
    QString CreateIsolatedTempDir(const QString& profileId) {
        QString tempBase = QStandardPaths::writableLocation(QStandardPaths::TempLocation);
        QString isolatedPath = tempBase + "/BAS_Isolated_" + profileId;
        
        QDir().mkpath(isolatedPath);
        
        // Set restrictive permissions
        QFile::setPermissions(isolatedPath, 
            QFile::ReadOwner | QFile::WriteOwner | QFile::ExeOwner);
        
        return isolatedPath;
    }
    
    void SetupIsolatedPaths(IsolationContext& context) {
        // Isolate common system paths
        context.isolatedPaths << QStandardPaths::writableLocation(QStandardPaths::DocumentsLocation);
        context.isolatedPaths << QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
        context.isolatedPaths << QStandardPaths::writableLocation(QStandardPaths::PicturesLocation);
        
        // Create isolated versions
        for (const QString& path : context.isolatedPaths) {
            QString isolatedPath = context.tempDirectory + "/" + QFileInfo(path).baseName();
            QDir().mkpath(isolatedPath);
        }
    }
};
```

### Memory Isolation

```cpp
class ProfileMemoryManager {
private:
    struct MemoryPool {
        QString profileId;
        size_t allocatedMemory;
        size_t maxMemoryLimit;
        QHash<void*, size_t> allocations;
        QMutex memoryMutex;
    };
    
    QHash<QString, MemoryPool> _memoryPools;
    
public:
    void* AllocateProfileMemory(const QString& profileId, size_t size) {
        QMutexLocker locker(&_memoryPools[profileId].memoryMutex);
        
        MemoryPool& pool = _memoryPools[profileId];
        
        // Check memory limit
        if (pool.allocatedMemory + size > pool.maxMemoryLimit) {
            throw std::bad_alloc();
        }
        
        void* ptr = malloc(size);
        if (ptr) {
            pool.allocations.insert(ptr, size);
            pool.allocatedMemory += size;
        }
        
        return ptr;
    }
    
    void DeallocateProfileMemory(const QString& profileId, void* ptr) {
        QMutexLocker locker(&_memoryPools[profileId].memoryMutex);
        
        MemoryPool& pool = _memoryPools[profileId];
        auto it = pool.allocations.find(ptr);
        
        if (it != pool.allocations.end()) {
            pool.allocatedMemory -= it.value();
            pool.allocations.erase(it);
            free(ptr);
        }
    }
    
    void CleanupProfileMemory(const QString& profileId) {
        QMutexLocker locker(&_memoryPools[profileId].memoryMutex);
        
        MemoryPool& pool = _memoryPools[profileId];
        
        // Free all allocations
        for (auto it = pool.allocations.begin(); it != pool.allocations.end(); ++it) {
            free(it.key());
        }
        
        pool.allocations.clear();
        pool.allocatedMemory = 0;
    }
};
```

## 🔐 Profile Security

### Profile Lock System

<augment_code_snippet path="Solution/ChromeWorker/main.cpp" mode="EXCERPT">
````cpp
// Ensure that profile is not busy
{
    std::wstring LockPath = Settings.Profile() + std::wstring(L"/lockfile");
    DeleteFile(LockPath.c_str());
    while(FileExists(LockPath)) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        DeleteFile(LockPath.c_str());
    }
}
````
</augment_code_snippet>

### Profile Encryption

```cpp
class ProfileEncryption {
private:
    QByteArray _encryptionKey;
    QString _keyDerivationSalt;
    
public:
    ProfileEncryption(const QString& password) {
        DeriveEncryptionKey(password);
    }
    
    bool EncryptProfileData(const QString& profilePath) {
        QStringList sensitiveFiles = {
            "fingerprint.json",
            "performance.json", 
            "proxy.txt",
            "cookies/Cookies"
        };
        
        for (const QString& file : sensitiveFiles) {
            QString filePath = profilePath + "/" + file;
            if (QFile::exists(filePath)) {
                if (!EncryptFile(filePath)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    bool DecryptProfileData(const QString& profilePath) {
        QStringList encryptedFiles = GetEncryptedFiles(profilePath);
        
        for (const QString& file : encryptedFiles) {
            if (!DecryptFile(file)) {
                return false;
            }
        }
        
        return true;
    }
    
private:
    void DeriveEncryptionKey(const QString& password) {
        // Use PBKDF2 for key derivation
        QCryptographicHash hash(QCryptographicHash::Sha256);
        QByteArray salt = _keyDerivationSalt.toUtf8();
        QByteArray passwordBytes = password.toUtf8();
        
        // Perform multiple iterations for security
        QByteArray derived = passwordBytes + salt;
        for (int i = 0; i < 10000; ++i) {
            hash.reset();
            hash.addData(derived);
            derived = hash.result();
        }
        
        _encryptionKey = derived;
    }
    
    bool EncryptFile(const QString& filePath) {
        QFile file(filePath);
        if (!file.open(QIODevice::ReadOnly)) {
            return false;
        }
        
        QByteArray data = file.readAll();
        file.close();
        
        QByteArray encryptedData = AESEncrypt(data, _encryptionKey);
        
        QFile encryptedFile(filePath + ".enc");
        if (!encryptedFile.open(QIODevice::WriteOnly)) {
            return false;
        }
        
        encryptedFile.write(encryptedData);
        encryptedFile.close();
        
        // Remove original file
        QFile::remove(filePath);
        
        return true;
    }
};
```

---

*Tài liệu này tiếp tục với các phần về Session Management, Performance Optimization và Advanced Profile Features.*
