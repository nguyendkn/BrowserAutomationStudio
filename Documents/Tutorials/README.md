# Tutorials

This section provides step-by-step tutorials for common BrowserAutomationStudio use cases, from basic automation to advanced scenarios.

## 📋 Table of Contents

- [Tutorial 1: Basic Web Scraping](#tutorial-1-basic-web-scraping)
- [Tutorial 2: Form Automation](#tutorial-2-form-automation)
- [Tutorial 3: Data Processing with Modules](#tutorial-3-data-processing-with-modules)
- [Tutorial 4: Creating Custom Modules](#tutorial-4-creating-custom-modules)
- [Tutorial 5: Advanced Scheduling](#tutorial-5-advanced-scheduling)
- [Tutorial 6: Error Handling and Recovery](#tutorial-6-error-handling-and-recovery)

## 🕷️ Tutorial 1: Basic Web Scraping

### Objective
Create a script to scrape product information from an e-commerce website.

### Prerequisites
- BrowserAutomationStudio installed
- Basic understanding of HTML and CSS selectors

### Step 1: Create New Project
1. Launch BrowserAutomationStudio
2. Click **File → New Project**
3. Name: "Product Scraper"
4. Location: Choose your projects folder
5. Click **Create**

### Step 2: Set Up the Browser
1. In the **Toolbox**, find **Browser** category
2. Drag **Load Page** to the scenario
3. In properties panel, set URL: `https://example-shop.com/products`
4. Set timeout: `10000` (10 seconds)

### Step 3: Wait for Content
1. Add **Wait for Element** action
2. Set selector: `.product-list`
3. Set timeout: `15000` (15 seconds)
4. This ensures the product list loads before proceeding

### Step 4: Extract Product Data
1. Add **Get Elements** action
2. Set selector: `.product-item`
3. Save to variable: `product_elements`

### Step 5: Loop Through Products
1. Add **Loop** action from **Logic** category
2. Set loop type: "For each element"
3. Set elements variable: `product_elements`
4. Set current element variable: `current_product`

### Step 6: Extract Individual Product Info
Inside the loop, add these actions:

1. **Get Text** - Product Name
   - Selector: `{{current_product}} .product-name`
   - Save to: `product_name`

2. **Get Text** - Product Price
   - Selector: `{{current_product}} .product-price`
   - Save to: `product_price`

3. **Get Attribute** - Product URL
   - Selector: `{{current_product}} a`
   - Attribute: `href`
   - Save to: `product_url`

### Step 7: Save Data
1. Add **String → Template** action
2. Template: `{{product_name}},{{product_price}},{{product_url}}`
3. Save to: `csv_line`

4. Add **FileSystem → Write File** action
   - File path: `products.csv`
   - Content: `{{csv_line}}`
   - Mode: "Append"

### Step 8: Test the Script
1. Click **Run** button
2. Monitor execution in browser window
3. Check `products.csv` file for results
4. Debug any selector issues using the Detector

### Expected Result
A CSV file containing product names, prices, and URLs from the target website.

## 📝 Tutorial 2: Form Automation

### Objective
Automate filling and submitting contact forms on multiple websites.

### Step 1: Create Resources
1. Right-click **Resources** → **Add Resource**
2. Create "contact_names" (File-based String)
   - Load from `names.txt` file
   - One name per line

3. Create "email_addresses" (File-based String)
   - Load from `emails.txt` file
   - Format: firstname.lastname@example.com

4. Create "phone_numbers" (File-based String)
   - Load from `phones.txt` file
   - Format: +1-555-0123

### Step 2: Create the Main Script
1. **Load Page**: Target contact form URL
2. **Wait for Element**: `#contact-form`

### Step 3: Fill Form Fields
1. **Type** - Name Field
   - Selector: `#name`
   - Text: `{{contact_names}}`
   - Clear field first: ✓

2. **Type** - Email Field
   - Selector: `#email`
   - Text: `{{email_addresses}}`
   - Clear field first: ✓

3. **Type** - Phone Field
   - Selector: `#phone`
   - Text: `{{phone_numbers}}`
   - Clear field first: ✓

### Step 4: Handle Dropdowns
1. **Select** - Country Dropdown
   - Selector: `#country`
   - Option: "United States"

2. **Select** - Subject Dropdown
   - Selector: `#subject`
   - Option: "General Inquiry"

### Step 5: Fill Message
1. **String → Template** - Generate Message
   - Template: `Hello, my name is {{contact_names}}. I am interested in your services. Please contact me at {{email_addresses}} or {{phone_numbers}}.`
   - Save to: `message_text`

2. **Type** - Message Field
   - Selector: `#message`
   - Text: `{{message_text}}`

### Step 6: Handle CAPTCHA (if present)
1. **If Element Exists**: `.captcha`
2. **Manual CAPTCHA Solver**
   - Selector: `.captcha img`
   - Input selector: `#captcha-input`
   - Timeout: 60000 (1 minute)

### Step 7: Submit Form
1. **Click** - Submit Button
   - Selector: `#submit-button`

2. **Wait for Any** - Success or Error
   - Selectors: `.success-message,.error-message`
   - Timeout: 10000

### Step 8: Handle Results
1. **If Element Exists**: `.success-message`
   - **Get Text**: Save success message
   - **Log**: "Form submitted successfully"

2. **Else If Element Exists**: `.error-message`
   - **Get Text**: Save error message
   - **Log**: "Form submission failed"
   - **Take Screenshot**: For debugging

### Step 9: Resource Management
1. **Release Resource**: `contact_names`
2. **Release Resource**: `email_addresses`
3. **Release Resource**: `phone_numbers`

## 🔧 Tutorial 3: Data Processing with Modules

### Objective
Process scraped data using various modules for cleaning and formatting.

### Step 1: Scrape Raw Data
1. Use the web scraping script from Tutorial 1
2. Save raw data to variables instead of files

### Step 2: Clean Product Names
1. **String → Trim** - Remove whitespace
   - Input: `{{product_name}}`
   - Save to: `clean_name`

2. **String → Replace** - Remove special characters
   - Input: `{{clean_name}}`
   - Find: `[^\w\s-]` (regex)
   - Replace with: `` (empty)
   - Save to: `clean_name`

### Step 3: Process Prices
1. **String → Replace** - Extract numeric price
   - Input: `{{product_price}}`
   - Find: `[^\d.]` (regex)
   - Replace with: `` (empty)
   - Save to: `numeric_price`

2. **String → To Number** - Convert to number
   - Input: `{{numeric_price}}`
   - Save to: `price_number`

### Step 4: Validate URLs
1. **URL → Validate** - Check URL format
   - Input: `{{product_url}}`
   - Save to: `is_valid_url`

2. **If** - URL is valid
   - Condition: `{{is_valid_url}} == true`
   - **URL → Make Absolute**
     - Base URL: `https://example-shop.com`
     - Relative URL: `{{product_url}}`
     - Save to: `absolute_url`

### Step 5: Create JSON Object
1. **JSON → Create Object**
   - Fields:
     ```json
     {
       "name": "{{clean_name}}",
       "price": {{price_number}},
       "url": "{{absolute_url}}",
       "scraped_at": "{{current_datetime}}"
     }
     ```
   - Save to: `product_json`

### Step 6: Validate Data
1. **JSON → Validate Schema**
   - JSON: `{{product_json}}`
   - Schema:
     ```json
     {
       "type": "object",
       "required": ["name", "price", "url"],
       "properties": {
         "name": {"type": "string", "minLength": 1},
         "price": {"type": "number", "minimum": 0},
         "url": {"type": "string", "format": "uri"}
       }
     }
     ```
   - Save result to: `is_valid_product`

### Step 7: Store Valid Data
1. **If** - Product is valid
   - Condition: `{{is_valid_product}} == true`
   - **Database → Insert Record**
     - Table: `products`
     - Data: `{{product_json}}`

2. **Else** - Invalid product
   - **Log**: "Invalid product data: {{product_json}}"
   - **FileSystem → Write File**
     - File: `invalid_products.log`
     - Content: `{{product_json}}\n`
     - Mode: "Append"

## 🔌 Tutorial 4: Creating Custom Modules

### Objective
Create a custom module for advanced text processing.

### Step 1: Module Structure
Create directory: `Solution/Modules/TextProcessor/js/`

### Step 2: Create Manifest
File: `manifest.json`
```json
{
    "name": "TextProcessor",
    "description": "Advanced text processing utilities",
    "api_version": 1,
    "major_version": 1,
    "minor_version": 0,
    "developer_name": "Your Name",
    "developer_email": "your.email@example.com",
    "actions": [
        {
            "name": "TextProcessor_Analyze",
            "description": {
                "en": "Analyze text properties",
                "ru": "Анализ свойств текста"
            },
            "template": "{{Text}} -> {{Analysis}}",
            "interface": "text_analyze_interface.js",
            "select": "text_analyze_select.js",
            "code": [{"file": "text_analyze_code.js", "name": "text_analyze_code"}]
        }
    ]
}
```

### Step 3: Create Interface
File: `text_analyze_interface.js`
```javascript
function GetInterface() {
    return {
        "Text": {
            "type": "string",
            "description": {"en": "Text to analyze", "ru": "Текст для анализа"},
            "required": true,
            "multiline": true
        },
        "IncludeWordCount": {
            "type": "boolean",
            "description": {"en": "Include word count", "ru": "Включить подсчет слов"},
            "default": true
        },
        "IncludeReadability": {
            "type": "boolean",
            "description": {"en": "Include readability score", "ru": "Включить оценку читаемости"},
            "default": false
        },
        "Analysis": {
            "type": "variable",
            "description": {"en": "Analysis result", "ru": "Результат анализа"},
            "required": true
        }
    };
}
```

### Step 4: Create Code Generator
File: `text_analyze_select.js`
```javascript
function GetCode(loader) {
    var text = GetInputConstructorValue("Text", loader);
    var includeWordCount = GetInputConstructorValue("IncludeWordCount", loader);
    var includeReadability = GetInputConstructorValue("IncludeReadability", loader);
    var analysis = GetInputConstructorValue("Analysis", loader);
    
    if (text["original"].length == 0) {
        Invalid(tr("Text parameter is required"));
        return;
    }
    
    if (analysis["original"].length == 0) {
        Invalid(tr("Analysis variable is required"));
        return;
    }
    
    try {
        var code = loader.GetAdditionalData() + _.template($("#text_analyze_code").html())({
            "Text": text["updated"],
            "IncludeWordCount": includeWordCount["updated"],
            "IncludeReadability": includeReadability["updated"],
            "Analysis": analysis["updated"]
        });
        
        code = Normalize(code, 0);
        BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
    } catch(e) {
        Invalid("Code generation error: " + e.message);
    }
}
```

### Step 5: Create Implementation
File: `text_analyze_code.js`
```javascript
<script type="text/template" id="text_analyze_code">
try {
    var inputText = {{Text}};
    var includeWordCount = {{IncludeWordCount}};
    var includeReadability = {{IncludeReadability}};
    
    var analysis = {
        character_count: inputText.length,
        character_count_no_spaces: inputText.replace(/\s/g, '').length,
        line_count: inputText.split('\n').length
    };
    
    if (includeWordCount) {
        var words = inputText.trim().split(/\s+/).filter(function(word) {
            return word.length > 0;
        });
        analysis.word_count = words.length;
        analysis.average_word_length = words.reduce(function(sum, word) {
            return sum + word.length;
        }, 0) / words.length;
    }
    
    if (includeReadability) {
        // Simple readability score (Flesch Reading Ease approximation)
        var sentences = inputText.split(/[.!?]+/).filter(function(s) {
            return s.trim().length > 0;
        });
        var words = inputText.trim().split(/\s+/).filter(function(word) {
            return word.length > 0;
        });
        var syllables = words.reduce(function(count, word) {
            return count + countSyllables(word);
        }, 0);
        
        if (sentences.length > 0 && words.length > 0) {
            var avgSentenceLength = words.length / sentences.length;
            var avgSyllablesPerWord = syllables / words.length;
            analysis.readability_score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
        }
    }
    
    {{Analysis}} = JSON.stringify(analysis, null, 2);
    
} catch (error) {
    console.error("TextProcessor error: " + error.message);
    throw error;
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    var matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}
</script>
```

### Step 6: Test the Module
1. Copy module to BAS modules directory
2. Restart BAS
3. Find "TextProcessor" in Toolbox
4. Create test script using the new action
5. Verify analysis results

## ⏰ Tutorial 5: Advanced Scheduling

### Objective
Set up complex scheduling scenarios with multiple tasks and dependencies.

### Step 1: Install Scheduler
1. Go to **Tools → Scheduler**
2. Click **Install Service**
3. Configure service settings
4. Start the scheduler service

### Step 2: Create Data Collection Task
1. **Task Name**: "Daily Data Collection"
2. **Script**: Your web scraping script
3. **Schedule**: `0 6 * * *` (Daily at 6 AM)
4. **Workers**: 3
5. **Resources**: Configure data sources

### Step 3: Create Data Processing Task
1. **Task Name**: "Process Collected Data"
2. **Script**: Data processing script
3. **Schedule**: `0 8 * * *` (Daily at 8 AM)
4. **Dependencies**: "Daily Data Collection"
5. **Workers**: 1

### Step 4: Create Report Generation Task
1. **Task Name**: "Generate Reports"
2. **Script**: Report generation script
3. **Schedule**: `0 10 * * 1-5` (Weekdays at 10 AM)
4. **Dependencies**: "Process Collected Data"
5. **Workers**: 1

### Step 5: Monitor Execution
1. Use Scheduler dashboard
2. Set up email notifications
3. Configure error alerts
4. Review execution logs

## 🛡️ Tutorial 6: Error Handling and Recovery

### Objective
Implement robust error handling and recovery mechanisms.

### Step 1: Basic Error Handling
```javascript
try {
    // Main automation logic
    load("https://example.com");
    wait_for_element("#content", 10000);
    
} catch (error) {
    console.error("Main logic failed: " + error.message);
    take_screenshot("error_" + Date.now() + ".png");
    
    // Attempt recovery
    if (error.message.includes("timeout")) {
        // Retry with longer timeout
        wait_for_element("#content", 30000);
    } else {
        // Log error and continue
        log_error("Unrecoverable error", error);
        throw error;
    }
}
```

### Step 2: Retry Mechanisms
```javascript
function executeWithRetry(operation, maxRetries, delay) {
    for (var attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return operation();
        } catch (error) {
            console.warn("Attempt " + attempt + " failed: " + error.message);
            
            if (attempt === maxRetries) {
                throw new Error("Operation failed after " + maxRetries + " attempts");
            }
            
            sleep(delay * attempt); // Exponential backoff
        }
    }
}

// Usage
executeWithRetry(function() {
    click("#submit-button");
    wait_for_element(".success", 5000);
}, 3, 2000);
```

### Step 3: Resource Recovery
```javascript
// Implement resource fallback
function getResourceWithFallback(primaryResource, fallbackResource) {
    try {
        return get_resource(primaryResource);
    } catch (error) {
        console.warn("Primary resource exhausted, using fallback");
        return get_resource(fallbackResource);
    }
}

var username = getResourceWithFallback("premium_users", "basic_users");
```

### Step 4: State Recovery
```javascript
// Save state for recovery
function saveState(state) {
    write_file("automation_state.json", JSON.stringify(state));
}

function loadState() {
    try {
        var stateData = read_file("automation_state.json");
        return JSON.parse(stateData);
    } catch (error) {
        return null; // No saved state
    }
}

// Use state recovery
var savedState = loadState();
if (savedState) {
    console.log("Resuming from saved state");
    // Resume from where we left off
} else {
    console.log("Starting fresh");
    // Start from beginning
}
```

---

*These tutorials provide practical, hands-on experience with BrowserAutomationStudio's key features and capabilities.*
