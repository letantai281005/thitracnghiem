# 🎓 QuizFlow - Hệ Thống Thi Trắc Nghiệm Trực Tuyến Premium

Chào mừng bạn đến với **QuizFlow** — một ứng dụng web thi trắc nghiệm trực tuyến cao cấp, sở hữu giao diện tinh tế bậc nhất (Rich Aesthetics) cùng đầy đủ các tính năng quản trị chuyên nghiệp dành cho đề tài **Đồ án cơ sở (DA:cs)** của bạn.

Hệ thống được thiết kế dưới dạng **Single Page Application (SPA)** mượt mà, sử dụng công nghệ thuần **HTML5, CSS3, và JavaScript ES6**, kết hợp hệ thống lưu trữ **Local Storage** thông minh để lưu và đồng bộ dữ liệu mà không cần cài đặt cơ sở dữ liệu cồng kềnh.

---

## ✨ Các Tính Năng Cao Cấp Bậc Nhất

### 1. 👨‍🎓 Giao Diện Thí Sinh & Bảng Điều Khiển (Student Dashboard)
*   **Greeting Cá Nhân Hóa**: Chào mừng thí sinh động dựa trên thời gian thực tế trong ngày (Sáng, Chiều, Tối) và đồng bộ ảnh đại diện tùy chọn.
*   **Thẻ Chỉ Số Thống Kê (Metric Cards)**: Hiển thị thời gian thực tổng số đề đã thi, điểm trung bình toàn bộ, tỷ lệ làm bài đạt (%) và tổng thời gian ôn luyện tích lũy.
*   **Bộ Lọc & Tìm Kiếm**: Bộ lọc tab nhanh theo môn học (Tin học, Tiếng Anh, Lịch sử...) cùng thanh tìm kiếm đề thi thời gian thực cực kỳ nhạy.
*   **Nhật Ký Thi Cá Nhân (History Log)**: Bảng thống kê toàn bộ lịch sử các lần thi trước, hiển thị rõ ràng ngày giờ thi, điểm số (xanh nếu Đạt, đỏ nếu Trượt), thời gian làm bài, và nút bấm xem lại chi tiết bài làm.
*   **Cấu Khiển Profile**: Widget dropdown góc phải cho phép người dùng đổi tên hiển thị và lựa chọn trong số 4 avatar cao cấp phong cách Modern Glassmorphism.

### 2. ⏱️ Môi Trường Làm Bài Thi Chuyên Nghiệp (Exam Engine)
*   **Thanh Tiến Trình**: Trực quan hóa số lượng câu hỏi đã hoàn thành dưới dạng thanh progress bar lướt chuyển động mượt mà.
*   **Đồng Hồ Đếm Ngược Hình Tròn (Circular SVG Timer)**: Thiết kế đồng hồ đếm ngược dạng vòng tròn tiến trình. Đồng hồ sẽ tự động đổi sang màu cam khi còn dưới 2 phút, đổi sang màu đỏ nhấp nháy liên tục khi còn dưới 1 phút và tự động kích hoạt nộp bài thi ngay lập tức khi thời gian chạm mốc `00:00`.
*   **Đánh Dấu Xem Lại (Flag Feature)**: Cho phép thí sinh đánh dấu câu hỏi chưa chắc chắn để quay lại kiểm tra nhanh thông qua bản đồ câu hỏi.
*   **Bản Đồ Câu Hỏi (Sidebar Grid Map)**: Một lưới hiển thị trạng thái của toàn bộ câu hỏi (Màu xám: Chưa làm, Màu xanh: Đã chọn đáp án, Màu vàng có icon cờ: Cần xem lại). Thí sinh có thể nhấp chuột vào bất cứ số thứ tự nào để nhảy nhanh đến câu hỏi đó.
*   **Hộp Thoại Xác Nhận Thông Minh**: Modal popup hiện ra trước khi nộp bài thi, tổng hợp chi tiết cho thí sinh biết họ đã làm bao nhiêu câu, bỏ trống bao nhiêu câu, và đánh dấu bao nhiêu câu để tránh các sai sót đáng tiếc.

### 3. 📊 Phân Tích Kết Quả & Xem Lại Đáp Án Chi Tiết (Detailed Review)
*   **Vòng Tròn Điểm Số**: Radial Gauge hiển thị tỷ lệ điểm phần trăm cực đẹp.
*   **Đánh Giá Đạt/Chưa Đạt**: Banner trạng thái động dựa trên điểm chuẩn đạt được cấu hình riêng của từng đề thi.
*   **Chi Tiết Từng Câu Hỏi (Answer Breakdown)**: Thí sinh có thể cuộn xem lại từng câu hỏi trong đề thi. Hệ thống sẽ làm nổi bật phương án thí sinh chọn (Màu đỏ nếu sai) và hiển thị đáp án đúng (Màu xanh lá cây có dấu check).
*   **Hộp Giải Thích Kiến Thức (Explanation Box)**: Đi kèm mỗi câu hỏi là phần giải thích chi tiết, khoa học lý giải tại sao đáp án đó lại đúng để thí sinh tự củng cố lỗ hổng kiến thức.

### 4. 🛡️ Trung Tâm Quản Trị Hệ Thống Toàn Diện (Admin Panel)
*   **Dashboard Số Liệu Tổng**: Báo cáo tổng thể số lượng đề thi đang có trên hệ thống, tổng số lượng câu hỏi trong ngân hàng đề, tổng số lượt làm bài thi của sinh viên, và điểm số trung bình toàn hệ thống.
*   **Quản Lý Đề Thi (Exam CRUD)**: Tạo mới đề thi, chỉnh sửa hoặc xóa đề thi. Thiết lập các thông số như Tên đề, Môn học, Thời gian làm bài (phút), Điểm chuẩn qua môn (%), Độ khó đề thi (Dễ, Trung bình, Khó) và Mô tả ngắn.
*   **Quản Lý Câu Hỏi Chi Tiết (Question CRUD)**: Khi chọn một đề thi bên trái, danh sách toàn bộ câu hỏi của đề đó sẽ hiện ra bên phải. Quản trị viên có thể thêm câu hỏi mới, chỉnh sửa nội dung, sửa 4 đáp án gây nhiễu, tích chọn đáp án đúng và bổ sung giải thích đáp án trực quan.
*   **Bảng Giám Sát Học Viên (Global Log)**: Bảng ghi nhận toàn bộ kết quả thi cử của tất cả học viên trên hệ thống (Tên học viên, Đề thi, Ngày làm, Điểm số, Đánh giá Đạt/Trượt).
*   **Tiện Ích Xuất Dữ Liệu**: Hỗ trợ xuất nhật ký thi cử của sinh viên ra tệp dữ liệu JSON để dễ dàng làm báo cáo Đồ án. Nút "Reset Hệ Thống" cho phép khôi phục tức thời về dữ liệu 3 đề thi mẫu chuẩn ban đầu.

---

## 🎨 Thiết Kế Giao Diện Cao Cấp (Aesthetics Design)

*   **Chế Độ Sáng/Tối (Light & Dark Themes)**: Chuyển đổi giao diện tức thì qua nút bấm, được thiết kế kỹ lưỡng từng tông màu từ Slate Grey huyền bí tới màu xám khói nhẹ nhàng nhằm mang lại sự thoải mái cho mắt khi ôn luyện ban đêm.
*   **Hiệu Ứng Glassmorphism**: Đầu trang (Header), thanh lọc và các hộp thoại popups sử dụng thuộc tính `backdrop-filter: blur(16px)` tạo cảm giác bóng bẩy, cao cấp tựa kính mờ.
*   **Micro-Animations**: Hiệu ứng co giãn, xoay nhẹ của các thẻ bài thi khi di chuột (`transform: translateY(-6px)`), nút bấm hover phát sáng dịu, vòng quay đồng hồ mượt mà, và các hiệu ứng trượt mở modal (`animate-slide-up`).

---

## 📂 Danh Sách Các Tệp Tin Trong Dự Án

Dự án được cấu trúc gọn gàng, bao gồm 3 tệp cốt lõi:
1.  [**`index.html`**](file:///c:/Users/ASUS/Desktop/thitracnghiem-main/index.html): Định nghĩa khung sườn ngữ nghĩa HTML5 chuẩn SEO, các phân vùng views (SPA), các cấu trúc modal popups biên tập đề/câu hỏi và trung tâm thông báo Toast.
2.  [**`style.css`**](file:///c:/Users/ASUS/Desktop/thitracnghiem-main/style.css): Tập trung toàn bộ hệ thống biến màu CSS (Light & Dark theme variables), kiểu dáng layout (Flexbox & Grid), các lớp hiệu ứng hover, sơ đồ bản đồ câu hỏi và các khung hình hoạt họa keyframes.
3.  [**`app.js`**](file:///c:/Users/ASUS/Desktop/thitracnghiem-main/app.js): Chứa toàn bộ lõi xử lý Logic của ứng dụng, cấu trúc dữ liệu mẫu ban đầu, cơ chế chấm điểm thi, xử lý vòng lặp đồng hồ đếm ngược, kiểm soát CRUD kho đề thi & câu hỏi của Admin, và bộ lưu trữ Local Storage tiện lợi.

---

## 🚀 Hướng Dẫn Chạy Dự Án Ngay Lập Tức

Vì dự án được xây dựng hoàn toàn bằng HTML, CSS, và JS thuần túy không phụ thuộc vào máy chủ cơ sở dữ liệu bổ sung, việc khởi chạy vô cùng đơn giản:

### Cách 1: Chạy trực tiếp qua trình duyệt (Đơn giản nhất)
Bạn chỉ cần click đúp chuột vào tệp [**`index.html`**](file:///c:/Users/ASUS/Desktop/thitracnghiem-main/index.html) hoặc nhấp chuột phải chọn **Open with** và chọn trình duyệt web bất kỳ (Google Chrome, Microsoft Edge, Firefox, Safari) để trải nghiệm dự án ngay tức khắc!

### Cách 2: Chạy qua Live Server trên VS Code (Khuyên dùng)
Nếu bạn có cài đặt phần mềm Visual Studio Code:
1.  Mở thư mục `thitracnghiem-main` bằng VS Code.
2.  Nếu chưa có, hãy cài đặt Extension có tên **Live Server**.
3.  Click vào nút **Go Live** ở góc dưới cùng bên phải của cửa sổ VS Code để chạy dự án trên một cổng local server (thường là `http://127.0.0.1:5500`).

---

Chúc bạn có một buổi trải nghiệm và báo cáo Đồ Án Cơ Sở thật thành công cùng phần mềm thi trắc nghiệm **QuizFlow**!
