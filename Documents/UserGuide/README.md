# Hướng Dẫn Người Dùng

Hướng dẫn này cung cấp các chỉ dẫn toàn diện cho người dùng cuối của BrowserAutomationStudio, bao gồm cài đặt, sử dụng cơ bản và các kịch bản tự động hóa thông thường.

## 📋 Mục Lục

- [Bắt Đầu](#bắt-đầu)
- [Tổng Quan Giao Diện](#tổng-quan-giao-diện)
- [Tạo Script Đầu Tiên](#tạo-script-đầu-tiên)
- [Làm Việc Với Tài Nguyên](#làm-việc-với-tài-nguyên)
- [Sử Dụng Module](#sử-dụng-module)
- [Lập Lịch Tác Vụ](#lập-lịch-tác-vụ)
- [Khắc Phục Sự Cố](#khắc-phục-sự-cố)

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống
- **Hệ Điều Hành**: Windows 10/11 (64-bit)
- **RAM**: Tối thiểu 4 GB, khuyến nghị 8 GB
- **Lưu Trữ**: 2 GB dung lượng trống
- **Kết Nối Internet**: Yêu cầu cho thiết lập ban đầu và cập nhật

### Cài Đặt
1. Tải xuống trình cài đặt BrowserAutomationStudio mới nhất
2. Chạy trình cài đặt với quyền Administrator
3. Làm theo hướng dẫn cài đặt
4. Khởi chạy BrowserAutomationStudio từ shortcut trên desktop

### Lần Khởi Chạy Đầu Tiên
Khi bạn khởi chạy BAS lần đầu, bạn sẽ thấy:
- Màn hình chào mừng với các tùy chọn bắt đầu nhanh
- Các dự án mẫu để khám phá
- Liên kết đến tài liệu và hướng dẫn

## 🖥️ Tổng Quan Giao Diện

### Các Thành Phần Cửa Sổ Chính

#### 1. Thanh Menu
- **File**: Các thao tác dự án (New, Open, Save, Export)
- **Edit**: Các thao tác chỉnh sửa (Undo, Redo, Find, Replace)
- **View**: Tùy chỉnh giao diện và panel
- **Tools**: Tiện ích và cài đặt
- **Help**: Tài liệu và hỗ trợ

#### 2. Thanh Công Cụ
Các nút truy cập nhanh cho các thao tác thông thường:
- Dự Án Mới
- Mở Dự Án
- Lưu Dự Án
- Chạy Script
- Dừng Thực Thi
- Chế Độ Debug

#### 3. Project Explorer
- **Scripts**: Các script tự động hóa của bạn
- **Resources**: Nguồn dữ liệu và biến
- **Modules**: Các module tự động hóa có sẵn
- **Results**: Kết quả thực thi và log

#### 4. Trình Soạn Thảo Script
- Giao diện kéo thả trực quan
- Chế độ xem code cho người dùng nâng cao
- Tô sáng cú pháp và xác thực
- Tự động hoàn thành và gợi ý

#### 5. Panel Thuộc Tính
- Cấu hình hành động
- Cài đặt tham số
- Xác thực và văn bản trợ giúp

#### 6. Panel Đầu Ra
- Log thực thi
- Thông báo lỗi
- Thông tin debug
- Số liệu hiệu năng

### Cửa Sổ Trình Duyệt
- **Toolbox**: Các hành động và module có sẵn
- **Scenario**: Biểu diễn script trực quan
- **Detector**: Công cụ chọn phần tử
- **Central**: Điều khiển và giám sát

## 📝 Tạo Script Đầu Tiên

### Bước 1: Tạo Dự Án Mới
1. Nhấp **File → New Project**
2. Chọn tên dự án và vị trí
3. Chọn template (hoặc bắt đầu trống)
4. Nhấp **Create**

### Bước 2: Thêm Các Hành Động Cơ Bản
1. Mở panel **Toolbox**
2. Điều hướng đến danh mục **Browser**
3. Kéo hành động **Load Page** vào scenario
4. Cấu hình URL trong panel thuộc tính

### Bước 3: Thêm Tương Tác Phần Tử
1. Sử dụng **Detector** để chọn các phần tử trên trang
2. Thêm các hành động như **Click**, **Type**, hoặc **Get Text**
3. Cấu hình selector và tham số
4. Kết nối các hành động theo trình tự logic

### Ví Dụ: Thu Thập Dữ Liệu Web Đơn Giản
```
1. Load Page: "https://example.com/products"
2. Wait for Element: ".product-list"
3. Get Text: ".product-name" → Lưu vào "product_names"
4. Get Text: ".product-price" → Lưu vào "product_prices"
5. Save to File: "products.csv"
```

### Bước 4: Kiểm Thử Script
1. Nhấp nút **Run** trong thanh công cụ
2. Giám sát thực thi trong cửa sổ trình duyệt
3. Kiểm tra panel đầu ra để xem kết quả
4. Debug các vấn đề bằng cách thực thi từng bước

## 📊 Làm Việc Với Tài Nguyên

Tài nguyên cung cấp dữ liệu cho các script tự động hóa của bạn. BAS hỗ trợ nhiều loại tài nguyên:

### Tài Nguyên Chuỗi
Lưu trữ dữ liệu văn bản cho script của bạn.

#### Chuỗi Cố Định
- Giá trị tĩnh đơn lẻ
- Sử dụng cho các hằng số như URL hoặc thông báo
- Ví dụ: "https://api.example.com"

#### Chuỗi Dựa Trên File
- Tải dữ liệu từ file văn bản
- Một giá trị mỗi dòng
- Hỗ trợ nhiều encoding khác nhau
- Ví dụ: Danh sách username từ usernames.txt

#### Chuỗi Cơ Sở Dữ Liệu
- Tải dữ liệu từ cơ sở dữ liệu
- Truy vấn SQL để chọn dữ liệu
- Hỗ trợ lọc và nhóm
- Ví dụ: Email khách hàng từ cơ sở dữ liệu

### Tài Nguyên Số Nguyên
Lưu trữ dữ liệu số cho script của bạn.

#### Số Nguyên Cố Định
- Số tĩnh đơn lẻ
- Sử dụng cho các hằng số như timeout hoặc số lượng
- Ví dụ: 5000 (timeout tính bằng millisecond)

#### Số Nguyên Ngẫu Nhiên
- Tạo số ngẫu nhiên trong phạm vi
- Sử dụng cho độ trễ hoặc lựa chọn ngẫu nhiên
- Ví dụ: Độ trễ ngẫu nhiên giữa 1000-5000ms

### Tạo Tài Nguyên
1. Nhấp chuột phải **Resources** trong Project Explorer
2. Chọn **Add Resource**
3. Chọn loại tài nguyên
4. Cấu hình tham số:
   - **Name**: Định danh duy nhất
   - **Type**: String, Integer, v.v.
   - **Source**: Fixed, File, Database, URL
   - **Parameters**: Cài đặt cụ thể theo loại

### Sử Dụng Tài Nguyên Trong Script
1. Trong thuộc tính hành động, nhấp nút biến
2. Chọn tài nguyên từ dropdown
3. Giá trị tài nguyên được phân phối tự động giữa các worker
4. Giá trị được giải phóng sau khi sử dụng để tái sử dụng

## 🔌 Using Modules

Modules extend BAS functionality with specialized actions.

### Built-in Modules

#### String Module
Text processing operations:
- **To Upper Case**: Convert to uppercase
- **To Lower Case**: Convert to lowercase
- **Replace**: Find and replace text
- **Split**: Split string by delimiter
- **Template**: Generate text from templates

#### JSON Module
JSON data manipulation:
- **Parse**: Convert JSON string to object
- **Get Value**: Extract values using JSONPath
- **Set Value**: Modify JSON data
- **Create**: Build JSON from scratch

#### FileSystem Module
File operations:
- **Read File**: Load file contents
- **Write File**: Save data to file
- **File Info**: Get file properties
- **Create Directory**: Create folders
- **Delete File**: Remove files

#### Database Module
Database operations:
- **Execute Query**: Run SQL queries
- **Insert Record**: Add new records
- **Update Record**: Modify existing data
- **Delete Record**: Remove records

### Installing Additional Modules
1. Go to **Tools → Module Manager**
2. Browse available modules
3. Click **Install** for desired modules
4. Restart BAS to activate modules

### Using Module Actions
1. Find module in **Toolbox**
2. Drag action to scenario
3. Configure parameters in properties
4. Connect to other actions as needed

## ⏰ Scheduling Tasks

The Scheduler allows automated execution of your scripts.

### Setting Up Scheduler
1. Go to **Tools → Scheduler**
2. Install scheduler service (one-time setup)
3. Configure scheduler settings
4. Start scheduler service

### Creating Scheduled Tasks
1. Open **Scheduler** interface
2. Click **Add Task**
3. Configure task properties:
   - **Name**: Task identifier
   - **Script**: Select your script
   - **Schedule**: When to run (cron format)
   - **Resources**: Data sources
   - **Workers**: Number of parallel instances

### Schedule Formats
- **Every hour**: `0 * * * *`
- **Daily at 9 AM**: `0 9 * * *`
- **Weekdays at 6 PM**: `0 18 * * 1-5`
- **Every 30 minutes**: `*/30 * * * *`

### Monitoring Execution
1. View **Task List** for status
2. Check **Execution History** for results
3. Monitor **System Resources** usage
4. Review **Logs** for detailed information

## 🔧 Troubleshooting

### Common Issues

#### Script Execution Fails
**Symptoms**: Script stops with errors
**Solutions**:
1. Check element selectors in Detector
2. Verify page loading times
3. Add appropriate wait conditions
4. Check for popup blockers or security warnings

#### Elements Not Found
**Symptoms**: "Element not found" errors
**Solutions**:
1. Use Detector to verify selectors
2. Add wait conditions before element interaction
3. Check for dynamic content loading
4. Verify page structure hasn't changed

#### Resource Exhaustion
**Symptoms**: "No more resources available"
**Solutions**:
1. Check resource configuration
2. Verify data source has sufficient entries
3. Implement resource recycling
4. Use infinite resources where appropriate

#### Performance Issues
**Symptoms**: Slow execution or high memory usage
**Solutions**:
1. Reduce number of parallel workers
2. Add delays between actions
3. Close unnecessary browser tabs
4. Monitor system resources

### Debug Mode
1. Enable **Debug Mode** in toolbar
2. Set breakpoints in script
3. Step through execution
4. Inspect variables and state
5. Modify parameters on-the-fly

### Getting Help
- **Built-in Help**: Press F1 or use Help menu
- **Community Forum**: Access through Help menu
- **Documentation**: Comprehensive guides and tutorials
- **Video Tutorials**: Step-by-step video guides
- **Support**: Contact support for technical issues

### Thực Hành Tốt Nhất
1. **Bắt Đầu Đơn Giản**: Bắt đầu với script cơ bản và tăng độ phức tạp dần dần
2. **Kiểm Thử Thường Xuyên**: Chạy script thường xuyên trong quá trình phát triển
3. **Sử Dụng Tên Mô Tả**: Đặt tên hành động và tài nguyên một cách rõ ràng
4. **Thêm Chú Thích**: Tài liệu hóa logic phức tạp
5. **Xử Lý Lỗi**: Thêm xử lý lỗi cho script mạnh mẽ
6. **Giám Sát Tài Nguyên**: Theo dõi việc sử dụng tài nguyên
7. **Sao Lưu Thường Xuyên**: Lưu file dự án thường xuyên

### Mẹo Hiệu Năng
1. **Tối Ưu Selector**: Sử dụng CSS selector hiệu quả
2. **Giảm Thiểu Chờ Đợi**: Sử dụng giá trị timeout phù hợp
3. **Nhóm Thao Tác**: Nhóm các hành động tương tự lại với nhau
4. **Quản Lý Tài Nguyên**: Giải phóng tài nguyên kịp thời
5. **Cài Đặt Trình Duyệt**: Tắt các tính năng không cần thiết
6. **Bảo Trì Hệ Thống**: Giữ hệ thống được cập nhật và sạch sẽ

---

*Hướng dẫn người dùng này cung cấp nền tảng để sử dụng BrowserAutomationStudio hiệu quả. Để biết các chủ đề nâng cao, xem phần [Hướng Dẫn](../Tutorials/README.md).*
