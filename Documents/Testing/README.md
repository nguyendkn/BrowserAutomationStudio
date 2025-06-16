# Testing Guide

This document provides comprehensive guidelines for testing BrowserAutomationStudio components, including unit testing, integration testing, and end-to-end testing strategies.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Framework](#testing-framework)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Test Organization](#test-organization)

## 🎯 Testing Philosophy

### Core Principles
1. **Test-Driven Development**: Write tests before implementation when possible
2. **Comprehensive Coverage**: Aim for high code coverage while focusing on critical paths
3. **Fast Feedback**: Tests should run quickly to enable rapid development cycles
4. **Reliable Tests**: Tests should be deterministic and not flaky
5. **Maintainable Tests**: Tests should be easy to understand and modify

### Testing Pyramid
```
    /\
   /  \     E2E Tests (Few, Slow, High Confidence)
  /____\
 /      \   Integration Tests (Some, Medium Speed)
/________\  Unit Tests (Many, Fast, Low Level)
```

## 🔧 Testing Framework

### C++ Testing with Qt Test
BAS uses Qt Test framework for C++ component testing.

#### Basic Test Structure
```cpp
#include <QtTest/QtTest>
#include <QObject>
#include "scriptmultiworker.h"
#include "mockbrowserfactory.h"
#include "mocklogger.h"

class ScriptMultiWorkerTest : public QObject
{
    Q_OBJECT

private slots:
    void initTestCase();
    void cleanupTestCase();
    void init();
    void cleanup();
    
    // Test methods
    void testWorkerInitialization();
    void testScriptExecution();
    void testErrorHandling();
    void testResourceAccess();
    
private:
    ScriptMultiWorker* _worker;
    MockBrowserFactory* _mockBrowserFactory;
    MockLogger* _mockLogger;
    MockResourceController* _mockResourceController;
};

void ScriptMultiWorkerTest::initTestCase()
{
    // One-time setup for all tests
    qDebug() << "Starting ScriptMultiWorker tests";
}

void ScriptMultiWorkerTest::init()
{
    // Setup before each test
    _mockBrowserFactory = new MockBrowserFactory();
    _mockLogger = new MockLogger();
    _mockResourceController = new MockResourceController();
    
    _worker = new ScriptMultiWorker();
    _worker->SetBrowserFactory(_mockBrowserFactory);
    _worker->SetLogger(_mockLogger);
    _worker->SetResourceController(_mockResourceController);
}

void ScriptMultiWorkerTest::cleanup()
{
    // Cleanup after each test
    delete _worker;
    delete _mockResourceController;
    delete _mockLogger;
    delete _mockBrowserFactory;
}

void ScriptMultiWorkerTest::testWorkerInitialization()
{
    // Test worker initialization
    QVERIFY(_worker != nullptr);
    QVERIFY(!_worker->IsRunning());
    QCOMPARE(_worker->GetActiveWorkerCount(), 0);
}

void ScriptMultiWorkerTest::testScriptExecution()
{
    // Arrange
    QString testScript = "console.log('test');";
    _worker->SetScript(testScript);
    _worker->SetThreadCount(1);
    
    // Set up mock expectations
    EXPECT_CALL(*_mockBrowserFactory, CreateBrowser())
        .WillOnce(Return(new MockBrowser()));
    
    // Act
    _worker->Start();
    
    // Wait for execution (with timeout)
    QSignalSpy finishedSpy(_worker, &IMultiWorker::WorkerFinished);
    QVERIFY(finishedSpy.wait(5000));
    
    // Assert
    QCOMPARE(finishedSpy.count(), 1);
    QVERIFY(_mockLogger->HasLogEntry("Script execution started"));
}

// Register test class
QTEST_MAIN(ScriptMultiWorkerTest)
#include "scriptmultiworkertest.moc"
```

### JavaScript Testing with Jest
For JavaScript components and modules, use Jest testing framework.

#### Basic Test Structure
```javascript
// tests/unit/modules/string_module.test.js
describe('String Module', () => {
    beforeEach(() => {
        // Setup before each test
        global.console = {
            log: jest.fn(),
            error: jest.fn()
        };
    });
    
    afterEach(() => {
        // Cleanup after each test
        jest.clearAllMocks();
    });
    
    describe('String Processing', () => {
        test('should convert string to uppercase', () => {
            // Arrange
            const input = 'hello world';
            const expected = 'HELLO WORLD';
            
            // Act
            const result = processSimple(input);
            
            // Assert
            expect(result).toBe(expected);
        });
        
        test('should handle empty string', () => {
            // Arrange
            const input = '';
            
            // Act & Assert
            expect(() => processSimple(input)).toThrow('Input parameter is empty');
        });
        
        test('should process advanced string manipulation', () => {
            // Arrange
            const input = 'hello';
            const expected = 'olleh';
            
            // Act
            const result = processAdvanced(input);
            
            // Assert
            expect(result).toBe(expected);
        });
    });
    
    describe('Error Handling', () => {
        test('should handle null input gracefully', () => {
            // Act & Assert
            expect(() => processSimple(null)).toThrow();
        });
        
        test('should log errors appropriately', () => {
            // Arrange
            const invalidInput = null;
            
            // Act
            try {
                processSimple(invalidInput);
            } catch (error) {
                // Expected error
            }
            
            // Assert
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('Input parameter is empty')
            );
        });
    });
});
```

## 🧪 Unit Testing

### Mock Objects
Create mock implementations for dependencies to isolate units under test.

#### Mock Browser Factory
```cpp
class MockBrowserFactory : public IBrowserFactory
{
public:
    MOCK_METHOD(IBrowser*, CreateBrowser, (), (override));
    MOCK_METHOD(void, ReleaseBrowser, (IBrowser* browser), (override));
    MOCK_METHOD(bool, IsAvailable, (), (const, override));
};

// Usage in tests
TEST_F(BrowserTest, ShouldCreateBrowser) {
    // Arrange
    auto mockBrowser = std::make_unique<MockBrowser>();
    EXPECT_CALL(*_mockFactory, CreateBrowser())
        .WillOnce(Return(mockBrowser.release()));
    
    // Act
    auto browser = _factory->CreateBrowser();
    
    // Assert
    ASSERT_NE(browser, nullptr);
    EXPECT_CALL(*_mockFactory, ReleaseBrowser(browser));
    _factory->ReleaseBrowser(browser);
}
```

#### Mock Resource Controller
```cpp
class MockResourceController : public IResourceController
{
public:
    MOCK_METHOD(QString, GetResource, (const QString& name, int workerId), (override));
    MOCK_METHOD(void, ReleaseResource, (const QString& name, const QString& value, int workerId), (override));
    MOCK_METHOD(bool, IsResourceAvailable, (const QString& name), (const, override));
};
```

### Test Data Management
```cpp
class TestDataManager
{
public:
    static QString GetTestScript() {
        return R"(
            console.log("Test script execution");
            var element = document.querySelector("#test-element");
            if (element) {
                element.click();
            }
        )";
    }
    
    static QJsonObject GetTestConfiguration() {
        QJsonObject config;
        config["timeout"] = 5000;
        config["retryCount"] = 3;
        config["enableLogging"] = true;
        return config;
    }
    
    static QString GetTestHtml() {
        return R"(
            <!DOCTYPE html>
            <html>
            <head><title>Test Page</title></head>
            <body>
                <div id="test-element">Click me</div>
                <input id="test-input" type="text" />
                <button id="test-button">Submit</button>
            </body>
            </html>
        )";
    }
};
```

## 🔗 Integration Testing

### Browser Integration Tests
Test browser automation functionality with real browser instances.

```cpp
class BrowserIntegrationTest : public QObject
{
    Q_OBJECT
    
private slots:
    void initTestCase();
    void cleanupTestCase();
    void init();
    void cleanup();
    
    void testPageNavigation();
    void testElementInteraction();
    void testJavaScriptExecution();
    void testResourceLoading();
    
private:
    IBrowser* _browser;
    QString _testPageUrl;
};

void BrowserIntegrationTest::initTestCase()
{
    // Setup test server with test pages
    _testPageUrl = "file://" + QDir::currentPath() + "/test_data/test_page.html";
}

void BrowserIntegrationTest::testPageNavigation()
{
    // Test page loading
    _browser->LoadUrl(_testPageUrl);
    _browser->WaitForLoad(10000);
    
    // Verify navigation
    QCOMPARE(_browser->GetUrl(), _testPageUrl);
    QVERIFY(_browser->GetTitle().contains("Test Page"));
    
    // Test navigation history
    _browser->LoadUrl("about:blank");
    _browser->WaitForLoad();
    _browser->GoBack();
    _browser->WaitForLoad();
    
    QCOMPARE(_browser->GetUrl(), _testPageUrl);
}

void BrowserIntegrationTest::testElementInteraction()
{
    // Load test page
    _browser->LoadUrl(_testPageUrl);
    _browser->WaitForLoad();
    
    // Find and interact with elements
    auto element = _browser->FindElement("#test-button");
    QVERIFY(element != nullptr);
    QVERIFY(element->IsDisplayed());
    QVERIFY(element->IsEnabled());
    
    // Click element
    element->Click();
    
    // Verify interaction result
    auto result = _browser->ExecuteScript("return document.getElementById('test-result').textContent;");
    QCOMPARE(result, "Button clicked");
}
```

### Module Integration Tests
Test module functionality within the BAS environment.

```javascript
// tests/integration/module_integration.test.js
describe('Module Integration Tests', () => {
    let testBrowser;
    let moduleManager;
    
    beforeAll(async () => {
        // Setup test environment
        testBrowser = await createTestBrowser();
        moduleManager = new ModuleManager();
        await moduleManager.loadModule('String');
    });
    
    afterAll(async () => {
        await testBrowser.close();
    });
    
    test('should execute string module action in browser context', async () => {
        // Arrange
        const script = `
            String_ToUpperCase("hello world", "result");
            return result;
        `;
        
        // Act
        const result = await testBrowser.executeScript(script);
        
        // Assert
        expect(result).toBe("HELLO WORLD");
    });
    
    test('should handle module errors gracefully', async () => {
        // Arrange
        const script = `
            try {
                String_ToUpperCase("", "result");
                return "no_error";
            } catch (error) {
                return error.message;
            }
        `;
        
        // Act
        const result = await testBrowser.executeScript(script);
        
        // Assert
        expect(result).toContain("Input parameter is empty");
    });
});
```

## 🌐 End-to-End Testing

### Scenario Testing
Test complete automation scenarios from start to finish.

```cpp
class EndToEndTest : public QObject
{
    Q_OBJECT
    
private slots:
    void testCompleteAutomationScenario();
    void testResourceManagement();
    void testErrorRecovery();
    
private:
    MainWindow* _mainWindow;
    QString _testProjectPath;
};

void EndToEndTest::testCompleteAutomationScenario()
{
    // 1. Create new project
    _mainWindow->CreateNewProject();
    
    // 2. Add automation script
    QString script = R"(
        load("https://example.com");
        wait_for_element("#login-form", 10000);
        type("#username", "testuser");
        type("#password", "testpass");
        click("#login-button");
        wait_for_element("#dashboard", 10000);
        var title = get_text("#page-title");
        console.log("Page title: " + title);
    )";
    
    _mainWindow->SetScript(script);
    
    // 3. Configure resources
    _mainWindow->AddStringResource("username", "testuser");
    _mainWindow->AddStringResource("password", "testpass");
    
    // 4. Execute script
    QSignalSpy executionFinished(_mainWindow, &MainWindow::ExecutionFinished);
    _mainWindow->StartExecution();
    
    // 5. Wait for completion
    QVERIFY(executionFinished.wait(30000));
    
    // 6. Verify results
    auto results = _mainWindow->GetExecutionResults();
    QVERIFY(results.success);
    QVERIFY(results.logs.contains("Page title:"));
}
```

### User Interface Testing
Test UI interactions and workflows.

```cpp
class UITest : public QObject
{
    Q_OBJECT
    
private slots:
    void testMainWindowInitialization();
    void testMenuActions();
    void testResourceWizard();
    void testModuleManager();
    
private:
    QApplication* _app;
    MainWindow* _mainWindow;
};

void UITest::testResourceWizard()
{
    // Open resource wizard
    QTest::mouseClick(_mainWindow->GetResourceButton(), Qt::LeftButton);
    
    // Find wizard dialog
    auto wizard = _mainWindow->findChild<ResourceWizard*>();
    QVERIFY(wizard != nullptr);
    QVERIFY(wizard->isVisible());
    
    // Configure string resource
    wizard->SetResourceType("String");
    wizard->SetResourceName("test_resource");
    wizard->SetResourceValue("test_value");
    
    // Complete wizard
    QTest::mouseClick(wizard->GetFinishButton(), Qt::LeftButton);
    
    // Verify resource was created
    auto resources = _mainWindow->GetResources();
    QVERIFY(resources.contains("test_resource"));
}
```

## ⚡ Performance Testing

### Benchmark Tests
Measure performance of critical components.

```cpp
class PerformanceTest : public QObject
{
    Q_OBJECT
    
private slots:
    void benchmarkScriptExecution();
    void benchmarkResourceAccess();
    void benchmarkBrowserOperations();
};

void PerformanceTest::benchmarkScriptExecution()
{
    ScriptMultiWorker worker;
    worker.SetScript("console.log('performance test');");
    worker.SetThreadCount(1);
    
    QBENCHMARK {
        worker.Start();
        QSignalSpy finished(&worker, &IMultiWorker::WorkerFinished);
        finished.wait(5000);
        worker.Stop();
    }
}

void PerformanceTest::benchmarkResourceAccess()
{
    ResourceController controller;
    controller.RegisterResource("test", new StringResourceHandler("test_value"));
    
    QBENCHMARK {
        for (int i = 0; i < 1000; ++i) {
            QString value = controller.GetResource("test");
            controller.ReleaseResource("test", value);
        }
    }
}
```

### Memory Testing
Monitor memory usage and detect leaks.

```cpp
class MemoryTest : public QObject
{
    Q_OBJECT
    
private slots:
    void testMemoryLeaks();
    void testMemoryUsage();
};

void MemoryTest::testMemoryLeaks()
{
    size_t initialMemory = getCurrentMemoryUsage();
    
    // Perform operations that should not leak memory
    for (int i = 0; i < 100; ++i) {
        auto browser = _factory->CreateBrowser();
        browser->LoadUrl("about:blank");
        browser->WaitForLoad();
        _factory->ReleaseBrowser(browser);
    }
    
    // Force garbage collection
    QCoreApplication::processEvents();
    
    size_t finalMemory = getCurrentMemoryUsage();
    size_t memoryDifference = finalMemory - initialMemory;
    
    // Allow for some memory growth but detect significant leaks
    QVERIFY(memoryDifference < 10 * 1024 * 1024); // 10MB threshold
}
```

## 📁 Test Organization

### Directory Structure
```
Tests/
├── unit/                   # Unit tests
│   ├── engine/                 # Engine component tests
│   │   ├── scriptmultiworker_test.cpp
│   │   ├── resources_test.cpp
│   │   └── modulemanager_test.cpp
│   ├── studio/                 # Studio component tests
│   │   ├── mainwindow_test.cpp
│   │   ├── compiler_test.cpp
│   │   └── databaseadmin_test.cpp
│   └── modules/                # Module tests
│       ├── string_module.test.js
│       ├── json_module.test.js
│       └── xpath_module.test.js
├── integration/            # Integration tests
│   ├── browser/                # Browser integration tests
│   ├── scheduler/              # Scheduler integration tests
│   └── modules/                # Module integration tests
├── e2e/                    # End-to-end tests
│   ├── scenarios/              # Complete automation scenarios
│   ├── ui/                     # User interface tests
│   └── performance/            # Performance tests
├── fixtures/               # Test data and fixtures
│   ├── test_pages/             # HTML test pages
│   ├── test_scripts/           # Test automation scripts
│   └── test_data/              # Test data files
└── utilities/              # Test utilities and helpers
    ├── mock_objects/           # Mock implementations
    ├── test_helpers/           # Helper functions
    └── test_data_manager/      # Test data management
```

### Test Configuration
```cmake
# CMakeLists.txt for tests
enable_testing()

# Unit tests
add_subdirectory(unit)

# Integration tests
add_subdirectory(integration)

# End-to-end tests
add_subdirectory(e2e)

# Test data
configure_file(fixtures/test_config.json ${CMAKE_BINARY_DIR}/test_config.json COPYONLY)
```

### Continuous Integration
```yaml
# .gitlab-ci.yml
test:
  stage: test
  script:
    - mkdir build
    - cd build
    - cmake ..
    - make
    - ctest --output-on-failure
  artifacts:
    reports:
      junit: build/test_results.xml
    paths:
      - build/coverage/
```

---

*Comprehensive testing ensures the reliability and quality of BrowserAutomationStudio components.*
