/* ==========================================================================
   QUIZFLOW SEED DATABASE
   Contains the complete set of 13 standard educational exams (165 questions)
   ========================================================================== */

const DEFAULT_EXAMS = [
    {
        id: "exam-tinhoc",
        title: "Tin học đại cương cơ bản",
        subject: "Tin học",
        duration: 10, // minutes
        passScore: 50, // %
        difficulty: "Trung bình",
        examCode: "TH101",
        description: "Kiểm tra kiến thức cốt lõi về tin học văn phòng, cấu trúc máy tính, hệ điều hành Windows và mạng máy tính cơ bản.",
        questions: [
            {
                id: "q-th-1",
                question: "Thiết bị phần cứng nào sau đây được ví như 'não bộ' đảm nhận chức năng xử lý chính của máy tính?",
                options: [
                    "Bộ nhớ truy cập ngẫu nhiên (RAM)",
                    "Bộ vi xử lý trung tâm (CPU)",
                    "Ổ đĩa cứng lưu trữ dữ liệu (SSD/HDD)",
                    "Bộ xử lý đồ họa độc lập (GPU)"
                ],
                correctAnswer: 1,
                explanation: "CPU (Central Processing Unit) là bộ xử lý trung tâm, có vai trò thực thi các câu lệnh của chương trình máy tính bằng cách thực hiện các phép tính số học, logic và so sánh."
            },
            {
                id: "q-th-2",
                question: "Trong hệ điều hành Windows, tổ hợp phím tắt chuẩn nào dùng để sao chép (copy) một đối tượng được chọn?",
                options: [
                    "Ctrl + C",
                    "Ctrl + V",
                    "Ctrl + X",
                    "Ctrl + Z"
                ],
                correctAnswer: 0,
                explanation: "Ctrl + C sao chép đối tượng vào Clipboard. Trái lại, Ctrl + V dùng để dán, Ctrl + X để cắt và Ctrl + Z để hoàn tác (undo)."
            },
            {
                id: "q-th-3",
                question: "Trong Microsoft Excel, hàm nào được sử dụng để tính giá trị trung bình cộng của một dãy ô số liệu?",
                options: [
                    "SUM()",
                    "AVERAGE()",
                    "COUNT()",
                    "MAX()"
                ],
                correctAnswer: 1,
                explanation: "Hàm AVERAGE() dùng để trả về trung bình cộng của các đối số. SUM() dùng tính tổng số lượng, COUNT() đếm số ô và MAX() tìm giá trị lớn nhất."
            },
            {
                id: "q-th-4",
                question: "Đâu là một ví dụ về 'Hệ điều hành máy tính' (Operating System) phổ biến nhất hiện nay?",
                options: [
                    "Google Chrome",
                    "Microsoft Windows 11",
                    "Microsoft Word 365",
                    "Adobe Photoshop Creative Cloud"
                ],
                correctAnswer: 1,
                explanation: "Windows 11 là hệ điều hành điều phối phần cứng và cung cấp môi trường chạy ứng dụng. Các tùy chọn khác chỉ là các trình duyệt và phần mềm ứng dụng cụ thể."
            },
            {
                id: "q-th-5",
                question: "Cụm từ viết tắt phổ biến 'LAN' trong hạ tầng mạng máy tính là gì?",
                options: [
                    "Local Area Network (Mạng cục bộ)",
                    "Long Active Network (Mạng diện rộng)",
                    "Light Access Node (Nút truy cập nhanh)",
                    "Link Area Network (Mạng liên kết)"
                ],
                correctAnswer: 0,
                explanation: "LAN viết tắt của Local Area Network (Mạng máy tính cục bộ), kết nối các thiết bị trong phạm vi địa lý nhỏ hẹp như văn phòng, tòa nhà hoặc nhà riêng."
            }
        ]
    },
    {
        id: "exam-english",
        title: "Tiếng Anh giao tiếp sơ cấp (Elementary English)",
        subject: "Tiếng Anh",
        duration: 15, // minutes
        passScore: 60, // %
        difficulty: "Dễ",
        examCode: "EN202",
        description: "Đánh giá trình độ ngữ pháp thông dụng, cấu trúc câu giao tiếp hàng ngày và vốn từ vựng căn bản.",
        questions: [
            {
                id: "q-en-1",
                question: "Which of the following words is widely used as a friendly greeting?",
                options: [
                    "Goodbye",
                    "Hello",
                    "Sleep",
                    "Running"
                ],
                correctAnswer: 1,
                explanation: "'Hello' is the standard polite word used when meeting or greeting someone, while 'Goodbye' is for parting."
            },
            {
                id: "q-en-2",
                question: "Identify the grammatically correct negative sentence in the Present Simple tense:",
                options: [
                    "She don't like drinking hot coffee.",
                    "She doesn't like drinking hot coffee.",
                    "She not likes drinking hot coffee.",
                    "She doesn't likes drinking hot coffee."
                ],
                correctAnswer: 1,
                explanation: "With the third-person singular pronoun (She/He/It), the auxiliary verb 'doesn't' is used, followed by the base form of the verb (like)."
            },
            {
                id: "q-en-3",
                question: "Choose the word that serves as the direct opposite (antonym) of 'Beautiful':",
                options: [
                    "Handsome",
                    "Pretty",
                    "Ugly",
                    "Cute"
                ],
                correctAnswer: 2,
                explanation: "'Ugly' refers to an unpleasant or unattractive appearance, which is the direct opposite of 'Beautiful' (pleasing to the senses)."
            },
            {
                id: "q-en-4",
                question: "Fill in the blank: 'I usually _______ to school by bicycle every morning.'",
                options: [
                    "goes",
                    "go",
                    "going",
                    "went"
                ],
                correctAnswer: 1,
                explanation: "The sentence describes a daily habit in the Simple Present tense. Since the subject is 'I', the verb remains in its plural/base form 'go'."
            },
            {
                id: "q-en-5",
                question: "What is the correct irregular past simple tense form of the verb 'BUY'?",
                options: [
                    "Buyed",
                    "Bought",
                    "Buying",
                    "Buys"
                ],
                correctAnswer: 1,
                explanation: "'BUY' is an irregular verb. Its past tense form is 'Bought', which does not follow the standard '-ed' suffix rule."
            }
        ]
    },
    {
        id: "exam-lichsu",
        title: "Lịch sử & Địa lý Việt Nam",
        subject: "Lịch sử",
        duration: 12, // minutes
        passScore: 50, // %
        difficulty: "Khó",
        examCode: "LS303",
        description: "Hỏi đáp nhanh về các dấu mốc anh hùng hào hùng lịch sử nước nhà và đặc điểm địa hình danh lam thắng cảnh Việt Nam.",
        questions: [
            {
                id: "q-ls-1",
                question: "Ai là người anh hùng lãnh đạo cuộc khởi nghĩa oanh liệt Hai Bà Trưng chống ách đô hộ nhà Đông Hán năm 40 sau CN?",
                options: [
                    "Ngô Quyền",
                    "Đinh Bộ Lĩnh",
                    "Trưng Trắc và Trưng Nhị",
                    "Lê Lợi"
                ],
                correctAnswer: 2,
                explanation: "Khởi nghĩa Hai Bà Trưng diễn ra vào năm 40 sau Công Nguyên do hai chị em Trưng Trắc và Trưng Nhị lãnh đạo tại Hát Môn (Hà Nội), lật đổ chính quyền đô hộ của thái thú Tô Định."
            },
            {
                id: "q-ls-2",
                question: "Thành phố mộng mơ nào tại nước ta được ưu ái mệnh danh là 'Thành phố ngàn hoa' nhờ khí hậu ôn đới quanh năm?",
                options: [
                    "Nha Trang",
                    "Đà Lạt",
                    "Hà Nội",
                    "Sapa"
                ],
                correctAnswer: 1,
                explanation: "Đà Lạt thuộc tỉnh Lâm Đồng trên cao nguyên Lâm Viên, có khí hậu mát mẻ quanh năm và đất đai màu mỡ vô cùng thích hợp cho các loại hoa sinh trưởng, nên được gọi là Thành phố ngàn hoa."
            },
            {
                id: "q-ls-3",
                question: "Chiến thắng Điện Biên Phủ lịch sử 'lừng lẫy năm châu, chấn động địa cầu' buộc thực dân Pháp ký Hiệp định Giơ-ne-vơ diễn ra vào năm nào?",
                options: [
                    "Năm 1945",
                    "Năm 1954",
                    "Năm 1968",
                    "Năm 1975"
                ],
                correctAnswer: 1,
                explanation: "Chiến dịch Điện Biên Phủ toàn thắng vào ngày 7 tháng 5 năm 1954, kết thúc thắng lợi cuộc kháng chiến chống Pháp oanh liệt của quân và dân ta (1946 - 1954)."
            },
            {
                id: "q-ls-4",
                question: "Đỉnh núi hùng vĩ nào nằm ở biên giới Lào Cai được vinh danh là 'Nóc nhà Đông Dương'?",
                options: [
                    "Fansipan (Phan-xi-păng)",
                    "Langbiang",
                    "Bạch Mã",
                    "Tây Côn Lĩnh"
                ],
                correctAnswer: 0,
                explanation: "Fansipan có độ cao 3.143 mét thuộc dãy Hoàng Liên Sơn, là ngọn núi cao nhất Việt Nam cũng như của ba nước Đông Dương (Việt Nam, Lào, Campuchia)."
            },
            {
                id: "q-ls-5",
                question: "Dòng sông nội địa nào có chiều dài lớn nhất chảy hoàn toàn bên trong lãnh thổ Việt Nam?",
                options: [
                    "Sông Mê Kông",
                    "Sông Hồng",
                    "Sông Đồng Nai",
                    "Sông Đà"
                ],
                correctAnswer: 2,
                explanation: "Sông Đồng Nai có chiều dài 586 km bắt nguồn từ Lâm Đồng và đổ ra biển Đông, là con sông nội địa dài nhất hoàn toàn trong ranh giới lãnh thổ Việt Nam."
            }
        ]
    },
    {
        id: "exam-webdev",
        title: "Lập trình Web Cơ bản (HTML, CSS, JavaScript)",
        subject: "Tin học",
        duration: 20,
        passScore: 50,
        difficulty: "Trung bình",
        description: "Kiểm tra kiến thức nền tảng về cấu trúc tài liệu HTML5, thuộc tính tạo kiểu dáng CSS3 và tư duy lập trình tương tác động JavaScript ES6.",
        questions: [
            {
                id: "q-wd-1",
                question: "Thẻ HTML5 tiêu chuẩn nào dùng để khai báo một tiêu đề (heading) có kích thước lớn nhất và quan trọng nhất trên trang web?",
                options: ["<head>", "<h6>", "<h1>", "<title>"],
                correctAnswer: 2,
                explanation: "Thẻ <h1> dùng để khai báo tiêu đề chính cấp 1 (lớn nhất và có thứ hạng SEO cao nhất). Thẻ <h6> khai báo tiêu đề nhỏ nhất, <head> chứa siêu dữ liệu và <title> khai báo tiêu đề trang hiển thị ở tab trình duyệt."
            },
            {
                id: "q-wd-2",
                question: "Thuộc tính HTML nào dùng để định nghĩa địa chỉ đường dẫn (URL) cho một liên kết neo thẻ <a>?",
                options: ["src", "href", "link", "class"],
                correctAnswer: 1,
                explanation: "Thuộc tính href (Hypertext Reference) chỉ định địa chỉ đích của liên kết. Thuộc tính src dùng cho thẻ hình ảnh/nhúng phần tử, link dùng liên kết CSS và class để gán tên lớp phong cách."
            },
            {
                id: "q-wd-3",
                question: "Trong CSS3, thuộc tính nào được sử dụng để thay đổi màu nền của một phần tử?",
                options: ["color", "background-color", "text-color", "bgcolor"],
                correctAnswer: 1,
                explanation: "Thuộc tính background-color dùng để thay đổi màu nền của phần tử trong CSS. Thuộc tính color dùng thay đổi màu chữ, các tuỳ chọn còn lại không hợp lệ trong tiêu chuẩn CSS hiện đại."
            },
            {
                id: "q-wd-4",
                question: "Để chọn tất cả các phần tử có tên class là 'active' trong tệp CSS, ta phải sử dụng bộ chọn (selector) nào?",
                options: ["#active", ".active", "*active", "active"],
                correctAnswer: 1,
                explanation: "Ký tự dấu chấm (.) dùng để đại diện bộ chọn theo tên Class trong CSS. Ký tự dấu thăng (#) chọn theo ID, và viết tên trực tiếp để chọn theo tên thẻ HTML."
            },
            {
                id: "q-wd-5",
                question: "Lệnh chuẩn nào trong JavaScript dùng để in các giá trị hoặc thông báo lỗi ra tab Console của trình duyệt nhằm phục vụ debug?",
                options: ["document.write()", "console.log()", "alert()", "print()"],
                correctAnswer: 1,
                explanation: "console.log() ghi nhận và in thông điệp ra màn hình console của trình duyệt. alert() tạo hộp thoại popup cảnh báo gây gián đoạn và document.write() chèn chuỗi trực tiếp vào tài liệu."
            },
            {
                id: "q-wd-6",
                question: "Từ khóa khai báo biến nào được giới thiệu trong ES6 có phạm vi khối (block-scope) và cho phép gán lại (reassign) giá trị?",
                options: ["var", "const", "let", "def"],
                correctAnswer: 2,
                explanation: "let khai báo biến phạm vi khối (block-scoped) có thể gán lại giá trị. const khai báo hằng số không thể gán lại, và var khai báo biến phạm vi hàm (function-scoped) kiểu cũ."
            },
            {
                id: "q-wd-7",
                question: "Hàm tích hợp (built-in) nào trong JavaScript được dùng để phân tích cú pháp chuỗi văn bản và chuyển đổi nó thành số nguyên?",
                options: ["parseInt()", "parseFloat()", "Number()", "Integer()"],
                correctAnswer: 0,
                explanation: "parseInt() phân tích chuỗi ký tự và chuyển đổi thành số nguyên cơ số 10. parseFloat() trả về số thực có dấu phẩy động và Number() chuyển đổi chung."
            },
            {
                id: "q-wd-8",
                question: "Trong chuẩn HTML5, thẻ ngữ nghĩa ngữ cảnh nào được dùng để nhúng trực tiếp âm thanh phát nhạc vào trang web?",
                options: ["<sound>", "<audio>", "<music>", "<media>"],
                correctAnswer: 1,
                explanation: "Thẻ <audio> là thẻ HTML5 tiêu chuẩn để nhúng các định dạng tệp tin âm thanh (như MP3, WAV, OGG) hỗ trợ điều khiển chơi nhạc mặc định."
            },
            {
                id: "q-wd-9",
                question: "Thuộc tính CSS3 nào được dùng để căn lề văn bản ở vị trí giữa theo chiều ngang trong khung phần tử chứa?",
                options: ["align: center", "text-align: center", "vertical-align: middle", "margin: center"],
                correctAnswer: 1,
                explanation: "text-align: center dùng để căn giữa các nội dung dạng văn bản hoặc inline bên trong một khối cha. align không tồn tại trong CSS, và vertical-align căn lề dọc."
            },
            {
                id: "q-wd-10",
                question: "Mô hình hộp (Box Model) trong CSS gồm những vùng đệm tính từ trong ra ngoài theo thứ tự chính xác nào?",
                options: [
                    "Content -> Padding -> Border -> Margin",
                    "Content -> Border -> Padding -> Margin",
                    "Content -> Margin -> Border -> Padding",
                    "Margin -> Border -> Padding -> Content"
                ],
                correctAnswer: 0,
                explanation: "Mô hình hộp Box Model bao gồm: Vùng nội dung (Content), Vùng đệm trong (Padding), Đường viền phần tử (Border), và Lề ranh giới ngoài (Margin)."
            },
            {
                id: "q-wd-11",
                question: "Tên của trình lắng nghe sự kiện nào trong JavaScript kích hoạt khi người dùng nhấp chuột trái vào một nút bấm?",
                options: ["onhover", "onclick", "onchange", "onsubmit"],
                correctAnswer: 1,
                explanation: "Sự kiện click (onclick) được kích hoạt khi người dùng nhấp chuột trái. onhover là hiệu ứng CSS, onchange kích hoạt khi thay đổi dữ liệu nhập và onsubmit dùng cho biểu mẫu."
            },
            {
                id: "q-wd-12",
                question: "Thẻ HTML nào dùng để tạo danh sách có thứ tự được đánh số tự động (1, 2, 3...) theo mặc định?",
                options: ["<ul>", "<ol>", "<li>", "<list>"],
                correctAnswer: 1,
                explanation: "Thẻ <ol> (Ordered List) tạo ra danh sách có thứ tự. Thẻ <ul> (Unordered List) tạo danh sách không thứ tự (dấu chấm tròn) và <li> là từng mục danh sách."
            },
            {
                id: "q-wd-13",
                question: "Trong các chế độ định vị CSS, thuộc tính 'position: fixed' sẽ neo giữ phần tử cố định so với thành phần nào?",
                options: [
                    "Phần tử cha gần nhất có thuộc tính position khác static",
                    "Cửa sổ hiển thị của trình duyệt (Viewport)",
                    "Vị trí dòng chảy tài liệu ban đầu của chính nó",
                    "Thẻ gốc <html> hoặc <body>"
                ],
                correctAnswer: 1,
                explanation: "Định vị fixed cố định phần tử so với khung nhìn trình duyệt (Viewport), giúp nó luôn ở một chỗ trên màn hình bất kể người dùng cuộn trang như thế nào."
            },
            {
                id: "q-wd-14",
                question: "Phương thức mảng (Array method) nào trong JavaScript dùng để chèn thêm một hoặc nhiều phần tử mới vào cuối của mảng hiện tại?",
                options: ["pop()", "push()", "shift()", "unshift()"],
                correctAnswer: 1,
                explanation: "push() chèn thêm phần tử vào cuối mảng và trả về chiều dài mới. pop() xoá ở cuối, shift() xoá ở đầu và unshift() chèn thêm phần tử vào đầu mảng."
            },
            {
                id: "q-wd-15",
                question: "Ký hiệu so sánh bằng nào trong JavaScript thực hiện đối chiếu nghiêm ngặt (so cả giá trị và kiểm tra trùng kiểu dữ liệu)?",
                options: ["==", "===", "=", "!="],
                correctAnswer: 1,
                explanation: "Toán tử === (Strict Equality) so sánh bằng nghiêm ngặt cả giá trị lẫn kiểu dữ liệu mà không ép kiểu ngầm. Toán tử == chỉ so sánh giá trị sau khi ép kiểu tự động."
            }
        ]
    },
    {
        id: "exam-database",
        title: "Hệ Quản Trị Cơ Sở Dữ Liệu & SQL",
        subject: "Tin học",
        duration: 15,
        passScore: 50,
        difficulty: "Trung bình",
        description: "Kiểm tra kỹ năng viết truy vấn SQL thao tác dữ liệu cơ bản, thiết lập ràng buộc thực thể, và liên kết bảng quan hệ RDBMS.",
        questions: [
            {
                id: "q-db-1",
                question: "Thuật ngữ viết tắt 'SQL' trong ngành quản trị cơ sở dữ liệu có nghĩa là gì?",
                options: [
                    "Structured Question Language",
                    "Structured Query Language",
                    "Simple Query League",
                    "Sequential Query Language"
                ],
                correctAnswer: 1,
                explanation: "SQL là viết tắt của Structured Query Language (Ngôn ngữ truy vấn có cấu trúc), dùng để giao tiếp và quản trị các cơ sở dữ liệu quan hệ."
            },
            {
                id: "q-db-2",
                question: "Từ khóa lệnh SQL cơ bản nào dùng để truy xuất và hiển thị dữ liệu từ một hoặc nhiều bảng?",
                options: ["SELECT", "GET", "EXTRACT", "SHOW"],
                correctAnswer: 0,
                explanation: "SELECT là câu lệnh SQL cốt lõi dùng để truy xuất thông tin dữ liệu từ bảng. GET và EXTRACT không phải từ khóa SQL truy xuất mặc định."
            },
            {
                id: "q-db-3",
                question: "Trong truy vấn SQL, mệnh đề nào được sử dụng để lọc các dòng kết quả thỏa mãn một điều kiện nhất định?",
                options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"],
                correctAnswer: 1,
                explanation: "Mệnh đề WHERE dùng để áp đặt điều kiện lọc lên các dòng riêng lẻ trước khi chúng được nhóm hay sắp xếp."
            },
            {
                id: "q-db-4",
                question: "Mệnh đề SQL nào dùng để sắp xếp các dòng kết quả trả về theo chiều tăng dần (ASC) hoặc giảm dần (DESC)?",
                options: ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"],
                correctAnswer: 1,
                explanation: "Mệnh đề ORDER BY dùng để chỉ định cột và thứ tự sắp xếp kết quả (mặc định là tăng dần ASC nếu không khai báo)."
            },
            {
                id: "q-db-5",
                question: "Hàm tổng hợp (Aggregate function) nào được dùng để đếm tổng số lượng bản ghi hoặc số dòng thỏa mãn điều kiện lọc?",
                options: ["SUM()", "COUNT()", "TOTAL()", "ADD()"],
                correctAnswer: 1,
                explanation: "Hàm COUNT() trả về tổng số bản ghi hoặc số dòng dữ liệu. SUM() dùng để cộng dồn các giá trị số học và không dùng để đếm số bản ghi."
            },
            {
                id: "q-db-6",
                question: "Ràng buộc (Constraint) toàn vẹn thực thể nào dùng để xác định tính duy nhất của dòng dữ liệu và cấm giá trị trống (NOT NULL)?",
                options: ["FOREIGN KEY", "PRIMARY KEY", "UNIQUE", "CHECK"],
                correctAnswer: 1,
                explanation: "PRIMARY KEY (Khóa chính) dùng để định danh duy nhất mỗi bản ghi trong bảng, bắt buộc mang tính duy nhất và không được phép chứa giá trị NULL."
            },
            {
                id: "q-db-7",
                question: "Để loại bỏ toàn bộ các dòng kết quả trùng lặp trong mệnh đề SELECT, ta phải sử dụng thêm từ khóa nào?",
                options: ["UNIQUE", "DISTINCT", "DIFFERENT", "SINGLE"],
                correctAnswer: 1,
                explanation: "Từ khóa DISTINCT đặt ngay sau SELECT để loại bỏ các bản ghi trùng lặp trong tập kết quả trả về."
            },
            {
                id: "q-db-8",
                question: "Khoá ngoại (Foreign Key) trong cấu trúc bảng cơ sở dữ liệu quan hệ được thiết lập nhằm mục đích chính nào?",
                options: [
                    "Đánh chỉ mục giúp tăng tốc độ tìm kiếm",
                    "Ngăn chặn việc sửa đổi bảng trực tiếp",
                    "Tạo mối liên kết quan hệ và đảm bảo toàn vẹn tham chiếu giữa hai bảng",
                    "Mã hóa bảo mật thông tin dòng dữ liệu"
                ],
                correctAnswer: 2,
                explanation: "Foreign Key (Khóa ngoại) là cột tham chiếu tới khóa chính của bảng khác, giúp ràng buộc tính toàn vẹn tham chiếu và tạo liên kết quan hệ."
            },
            {
                id: "q-db-9",
                question: "Lệnh SQL nào dùng để thêm các dòng bản ghi dữ liệu mới vào bên trong một bảng?",
                options: ["INSERT INTO", "ADD ROW", "UPDATE", "CREATE RECORD"],
                correctAnswer: 0,
                explanation: "Lệnh INSERT INTO dùng để chèn thêm các dòng dữ liệu mới vào bảng. UPDATE dùng sửa đổi và CREATE dùng tạo cấu trúc bảng."
            },
            {
                id: "q-db-10",
                question: "Để thay đổi, cập nhật lại dữ liệu của một bản ghi đã tồn tại trong bảng, ta sử dụng tổ hợp lệnh SQL nào?",
                options: ["ALTER", "UPDATE", "CHANGE", "MODIFY"],
                correctAnswer: 1,
                explanation: "Lệnh UPDATE dùng cập nhật lại dữ liệu dòng bản ghi hiện có, kết hợp với mệnh đề SET. ALTER dùng sửa cấu trúc cột của bảng."
            },
            {
                id: "q-db-11",
                question: "Để xóa các dòng dữ liệu cụ thể trong bảng nhưng vẫn giữ nguyên cấu trúc khung của bảng đó, ta dùng lệnh nào?",
                options: ["DROP TABLE", "DELETE FROM", "TRUNCATE COLUMN", "REMOVE"],
                correctAnswer: 1,
                explanation: "DELETE FROM dùng xóa một hoặc nhiều dòng dữ liệu cụ thể (có kèm WHERE). DROP TABLE xóa hoàn toàn cả dữ liệu lẫn cấu trúc bảng khỏi hệ thống."
            },
            {
                id: "q-db-12",
                question: "Khi cần gom nhóm các dòng dữ liệu dựa vào giá trị trùng lặp của các cột để thực hiện hàm tổng hợp, ta dùng mệnh đề nào?",
                options: ["SORT BY", "GROUP BY", "HAVING", "COLLECT BY"],
                correctAnswer: 1,
                explanation: "Mệnh đề GROUP BY nhóm các dòng dữ liệu có cùng giá trị lại với nhau để thực hiện các phép gộp số liệu như SUM, AVG, COUNT."
            },
            {
                id: "q-db-13",
                question: "Mệnh đề nào đóng vai trò như bộ lọc điều kiện áp dụng riêng cho các dữ liệu sau khi đã được nhóm bởi GROUP BY?",
                options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
                correctAnswer: 1,
                explanation: "Mệnh đề HAVING dùng để lọc các kết quả gộp sau khi nhóm (GROUP BY). WHERE lọc các dòng riêng lẻ trước khi nhóm."
            },
            {
                id: "q-db-14",
                question: "Phép liên kết JOIN nào trả về tất cả các dòng dữ liệu khi xuất hiện sự khớp thông tin ở bất kỳ bảng trái hoặc bảng phải nào?",
                options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"],
                correctAnswer: 2,
                explanation: "FULL OUTER JOIN trả về toàn bộ bản ghi của cả hai bảng, kết hợp giá trị khớp và điền NULL cho các trường không có dữ liệu đối ứng."
            },
            {
                id: "q-db-15",
                question: "Hệ quản trị cơ sở dữ liệu mã nguồn mở miễn phí vô cùng phổ biến hỗ trợ SQL nào dưới đây thuộc loại cơ sở dữ liệu quan hệ (RDBMS)?",
                options: ["MongoDB", "MySQL", "Redis", "Cassandra"],
                correctAnswer: 1,
                explanation: "MySQL là hệ quản trị cơ sở dữ liệu quan hệ (RDBMS). MongoDB là CSDL hướng tài liệu (NoSQL), Redis lưu trữ key-value và Cassandra dạng column-family."
            }
        ]
    },
    {
        id: "exam-network",
        title: "Mạng Máy Tính & An Toàn Thông Tin",
        subject: "Tin học",
        duration: 20,
        passScore: 50,
        difficulty: "Khó",
        description: "Hệ thống câu hỏi nâng cao kiểm tra lý thuyết mô hình OSI, giao thức truyền tải TCP/IP, cổng dịch vụ mạng và các mối đe doạ an ninh mạng.",
        questions: [
            {
                id: "q-net-1",
                question: "Mô hình tham chiếu kết nối hệ thống mở tiêu chuẩn OSI gồm tổng cộng có bao nhiêu tầng (layers)?",
                options: ["5 Tầng", "6 Tầng", "7 Tầng", "8 Tầng"],
                correctAnswer: 2,
                explanation: "Mô hình OSI có 7 tầng xếp thứ tự từ dưới lên: Physical, Data Link, Network, Transport, Session, Presentation, và Application."
            },
            {
                id: "q-net-2",
                question: "Địa chỉ giao thức Internet phiên bản 4 (IPv4) tiêu chuẩn được cấu tạo từ bao nhiêu bit dữ liệu nhị phân?",
                options: ["16 bit", "32 bit", "64 bit", "128 bit"],
                correctAnswer: 1,
                explanation: "Địa chỉ IPv4 gồm 32 bit, chia làm 4 nhóm byte viết dưới dạng số thập phân cách nhau bởi dấu chấm (ví dụ: 192.168.1.1). IPv6 sử dụng 128 bit."
            },
            {
                id: "q-net-3",
                question: "Giao thức phân giải địa chỉ nào có vai trò ánh xạ địa chỉ IP (tầng logic) sang địa chỉ MAC vật lý của thiết bị?",
                options: ["ARP", "DHCP", "DNS", "ICMP"],
                correctAnswer: 0,
                explanation: "ARP (Address Resolution Protocol) phân giải địa chỉ IP sang địa chỉ vật lý MAC. DNS phân giải tên miền thành IP và DHCP tự động cấp IP."
            },
            {
                id: "q-net-4",
                question: "Cổng dịch vụ (Port number) mặc định được dùng cho kết nối bảo mật mã hóa HTTPS trong mạng Internet là cổng nào?",
                options: ["Port 80", "Port 443", "Port 21", "Port 22"],
                correctAnswer: 1,
                explanation: "Port 443 là cổng tiêu chuẩn dành cho HTTPS (truyền tải web mã hóa bảo mật). Port 80 dành cho HTTP, Port 21 dành cho FTP và Port 22 dành cho SSH."
            },
            {
                id: "q-net-5",
                question: "Giao thức tầng ứng dụng nào đảm nhiệm nhiệm vụ tự động cấu hình và cấp phát địa chỉ IP cho các máy trạm (client)?",
                options: ["DNS", "DHCP", "FTP", "SMTP"],
                correctAnswer: 1,
                explanation: "DHCP (Dynamic Host Configuration Protocol) tự động gán địa chỉ IP, subnet mask, gateway và DNS server cho các thiết bị khi chúng kết nối mạng."
            },
            {
                id: "q-net-6",
                question: "Thiết bị định tuyến mạng (Router) hoạt động chủ yếu ở tầng thứ mấy (Layer mấy) trong mô hình mạng OSI?",
                options: ["Tầng 2 (Data Link Layer)", "Tầng 3 (Network Layer)", "Tầng 4 (Transport Layer)", "Tầng 5 (Session Layer)"],
                correctAnswer: 1,
                explanation: "Router hoạt động ở tầng 3 (Network Layer) để định tuyến gói tin dữ liệu chéo qua các mạng dựa trên địa chỉ logic IP."
            },
            {
                id: "q-net-7",
                question: "Giao thức truyền tải (Transport protocol) hướng kết nối nào đảm bảo truyền tin cậy, sắp xếp đúng thứ tự gói tin và kiểm soát luồng dữ liệu?",
                options: ["TCP", "UDP", "IP", "ICMP"],
                correctAnswer: 0,
                explanation: "TCP (Transmission Control Protocol) là giao thức truyền tải tin cậy có kết nối bắt tay 3 bước. UDP là giao thức không liên kết, không đảm bảo tin cậy nhưng tốc độ nhanh."
            },
            {
                id: "q-net-8",
                question: "Mã trạng thái phản hồi HTTP (HTTP status code) nào đại diện cho lỗi Client chưa thực hiện xác thực thông tin tài khoản (Unauthorized)?",
                options: ["Mã lỗi 400", "Mã lỗi 401", "Mã lỗi 403", "Mã lỗi 404"],
                correctAnswer: 1,
                explanation: "Mã 401 biểu thị lỗi Unauthorized (yêu cầu xác thực tài khoản). Mã 403 biểu thị lỗi Forbidden (bị cấm truy cập) và 404 biểu thị Not Found."
            },
            {
                id: "q-net-9",
                question: "Giải pháp bảo mật mạng VPN (Virtual Private Network) được xây dựng nhằm cung cấp mục đích chính nào?",
                options: [
                    "Tăng tốc độ băng thông kết nối Internet vượt mức giới hạn nhà mạng",
                    "Mã hóa kênh truyền tạo đường hầm kết nối bảo mật trên mạng công cộng",
                    "Ngăn chặn mọi loại virus phần mềm xâm nhập ổ cứng",
                    "Phát hiện xâm nhập trái phép từ xa"
                ],
                correctAnswer: 1,
                explanation: "VPN (Mạng riêng ảo) mã hóa dữ liệu truyền đi, tạo ra một đường truyền an toàn (tunneling) bảo mật thông tin trên môi trường mạng Internet công cộng."
            },
            {
                id: "q-net-10",
                question: "Kỹ thuật tấn công giả mạo (Social Engineering) nào lừa gạt nạn nhân cung cấp thông tin nhạy cảm qua email hoặc trang web nhái giao diện ngân hàng?",
                options: ["DDoS Attack", "Phishing", "Man-in-the-middle", "SQL Injection"],
                correctAnswer: 1,
                explanation: "Phishing (tấn công giả mạo) sử dụng các email dụ dỗ hoặc website fake y hệt thực tế để lừa người dùng tự điền mật khẩu, thông tin thẻ tín dụng."
            },
            {
                id: "q-net-11",
                question: "Hệ thống phần cứng hoặc phần mềm chuyên dụng kiểm soát luồng thông tin ra vào mạng, ngăn chặn các xâm nhập bất hợp pháp gọi là gì?",
                options: ["Router", "Firewall (Tường lửa)", "Switch", "Anti-Virus"],
                correctAnswer: 1,
                explanation: "Firewall (Tường lửa) thiết lập các quy tắc giám sát cổng, kiểm soát lưu lượng mạng để ngăn chặn các truy cập nguy hiểm từ bên ngoài vào mạng nội bộ."
            },
            {
                id: "q-net-12",
                question: "Thuật toán mã hóa khóa đối xứng (Symmetric cryptography) cực kỳ phổ biến và bảo mật cao được dùng làm tiêu chuẩn mã hóa nâng cao toàn cầu là gì?",
                options: ["RSA", "AES", "MD5", "SHA-256"],
                correctAnswer: 1,
                explanation: "AES (Advanced Encryption Standard) là thuật toán mã hóa đối xứng an toàn nhất hiện nay. RSA là bất đối xứng, MD5 và SHA-256 là thuật toán băm (hashing)."
            },
            {
                id: "q-net-13",
                question: "Địa chỉ vật lý duy nhất được gán cố định cho card mạng của thiết bị khi xuất xưởng (địa chỉ MAC) có độ dài bao nhiêu byte?",
                options: ["4 Byte", "6 Byte", "8 Byte", "16 Byte"],
                correctAnswer: 1,
                explanation: "Địa chỉ MAC gồm 48 bit (tương đương với 6 byte), thường viết dưới dạng 6 nhóm chữ số thập lục phân cách nhau bởi dấu hai chấm (ví dụ: AA:BB:CC:DD:EE:FF)."
            },
            {
                id: "q-net-14",
                question: "Hệ thống phân giải tên miền (DNS) giúp chuyển đổi ký tự tên miền sang IP hoạt động chủ yếu ở tầng nào của mô hình OSI?",
                options: ["Tầng mạng (Network Layer)", "Tầng truyền tải (Transport Layer)", "Tầng trình diễn (Presentation Layer)", "Tầng ứng dụng (Application Layer)"],
                correctAnswer: 3,
                explanation: "DNS là dịch vụ chạy ở tầng 7 (Application Layer - Tầng ứng dụng) giúp con người tương tác dịch vụ mạng thông qua tên miền thay vì nhớ dãy số IP khô khan."
            },
            {
                id: "q-net-15",
                question: "Giao thức truyền tải thư tín mạng tiêu chuẩn nào chịu trách nhiệm gửi email đi từ Mail Client lên Mail Server?",
                options: ["POP3", "SMTP", "IMAP", "HTTP"],
                correctAnswer: 1,
                explanation: "SMTP (Simple Mail Transfer Protocol) là giao thức chuẩn chuyên dụng gửi thư điện tử đi. POP3 và IMAP là các giao thức tải hoặc quản lý thư ở đầu nhận."
            }
        ]
    },
    {
        id: "exam-bus-english",
        title: "Tiếng Anh Giao Tiếp Công Sở & Thương Mại",
        subject: "Tiếng Anh",
        duration: 15,
        passScore: 60,
        difficulty: "Trung bình",
        description: "Đánh giá khả năng hiểu thuật ngữ văn phòng, cách viết thư tín thương mại lịch sự, giao tiếp cuộc họp và thuật ngữ viết tắt trong doanh nghiệp.",
        questions: [
            {
                id: "q-be-1",
                question: "Which of the following salutations is the most appropriate way to start a highly formal business email to an unknown recipient?",
                options: [
                    "Hey there,",
                    "Dear Sir or Madam,",
                    "To whom it may worry,",
                    "Hi guys,"
                ],
                correctAnswer: 1,
                explanation: "'Dear Sir or Madam,' is the standard respectful and professional way to address a recipient whose name or gender you do not know."
            },
            {
                id: "q-be-2",
                question: "What does the commonly used business email abbreviation 'ASAP' stand for?",
                options: [
                    "As simple as possible",
                    "As soon as possible",
                    "Always sent after payment",
                    "Advanced sales and promotion"
                ],
                correctAnswer: 1,
                explanation: "'ASAP' stands for 'As soon as possible', indicating that a task or reply is highly urgent and should be handled immediately."
            },
            {
                id: "q-be-3",
                question: "Choose the most polite and natural phrase to propose or schedule a meeting with a client:",
                options: [
                    "You must meet me tomorrow at 9 AM.",
                    "I would like to arrange a meeting at your earliest convenience.",
                    "Let's meet tomorrow, okay?",
                    "Schedule a meeting for us right now."
                ],
                correctAnswer: 1,
                explanation: "'I would like to arrange... at your earliest convenience' is extremely polite, professional, and shows respect for the client's schedule."
            },
            {
                id: "q-be-4",
                question: "If you have attached an important document (like a report or resume) to an email, how should you notify the reader politely?",
                options: [
                    "Look at my attachment down here.",
                    "Please find attached the requested report.",
                    "I have pasted the file in this mail.",
                    "The file is inside this computer."
                ],
                correctAnswer: 1,
                explanation: "'Please find attached...' is the standard formal phrase used in business correspondence to draw attention to attached documents."
            },
            {
                id: "q-be-5",
                question: "Which of the following is the most professional and polite way to ask a colleague or manager for clarification on a confusing task?",
                options: [
                    "Explain this to me because it is confusing.",
                    "Could you please clarify the details of this task?",
                    "I don't understand anything you wrote.",
                    "Write it again but make it clear."
                ],
                correctAnswer: 1,
                explanation: "'Could you please clarify...' is a polite indirect question that requests assistance professionally without sounding demanding or critical."
            },
            {
                id: "q-be-6",
                question: "When a manager says 'Thank you for your excellent work on this project!', what is the most polite professional response?",
                options: [
                    "No problem, it was easy.",
                    "You're welcome. It was a pleasure working on it.",
                    "Don't worry about it.",
                    "Of course I did well."
                ],
                correctAnswer: 1,
                explanation: "'You're welcome. It was a pleasure...' is a polished, warm, and highly professional response that expresses pride and teamwork."
            },
            {
                id: "q-be-7",
                question: "What does the common workplace idiom 'to touch base' mean in a business context?",
                options: [
                    "To build a new company headquarter",
                    "To briefly contact or talk to someone to update information",
                    "To hit the baseline in sports",
                    "To play games at work"
                ],
                correctAnswer: 1,
                explanation: "'To touch base' is a common business idiom meaning to make brief contact with someone to talk, check progress, or exchange updates."
            },
            {
                id: "q-be-8",
                question: "Fill in the blank: 'In order to launch the product on time, we need to _______ a final decision by the end of the day.'",
                options: ["take", "make", "do", "get"],
                correctAnswer: 1,
                explanation: "The standard English collocation is to 'make a decision' (đưa ra quyết định), not 'do a decision' or 'take a decision'."
            },
            {
                id: "q-be-9",
                question: "Choose the most polite and professional phrase to decline an invitation to a business dinner due to a busy schedule:",
                options: [
                    "I will not come because I am too busy.",
                    "I reject this dinner invite.",
                    "Thank you for the invitation. Unfortunately, I have a prior commitment.",
                    "Dinner is bad for my schedule."
                ],
                correctAnswer: 2,
                explanation: "'Thank you... Unfortunately, I have a prior commitment' is a highly polished way to say you cannot attend because of another scheduled event."
            },
            {
                id: "q-be-10",
                question: "What is the exact definition of a 'deadline' in a professional project setting?",
                options: [
                    "A dangerous line on a map",
                    "The specific time or date by which a task must be completed",
                    "A telephone line that is no longer working",
                    "A list of retired employees"
                ],
                correctAnswer: 1,
                explanation: "A deadline is the ultimate time limit or target date by which a piece of work, project, or task must be submitted or finished."
            },
            {
                id: "q-be-11",
                question: "Fill in the blank with the correct grammatical form: 'I am looking forward to _______ from you soon.'",
                options: ["hear", "hearing", "be heard", "heard"],
                correctAnswer: 1,
                explanation: "The phrasal verb 'look forward to' is followed by a preposition 'to', which requires a gerund/V-ing ('hearing')."
            },
            {
                id: "q-be-12",
                question: "What is the main responsibility of a designated 'minutes taker' during a formal corporate meeting?",
                options: [
                    "To count how many minutes the meeting lasts",
                    "To write down official records of discussions, key decisions, and action items",
                    "To serve tea and coffee during breaks",
                    "To interrupt speakers when they talk too long"
                ],
                correctAnswer: 1,
                explanation: "Taking the 'minutes' of a meeting means writing down a structured summary of what was discussed, what decisions were reached, and who is responsible for future tasks."
            },
            {
                id: "q-be-13",
                question: "What does the common acronym 'FAQ' mean on customer support pages?",
                options: [
                    "Fast Answer Question",
                    "Frequently Asked Questions",
                    "Formal Alternative Query",
                    "First Asked Quality"
                ],
                correctAnswer: 1,
                explanation: "'FAQ' stands for 'Frequently Asked Questions' (Các câu hỏi thường gặp), a list of common queries and answers compiled for users."
            },
            {
                id: "q-be-14",
                question: "Select the vocabulary word that means 'to postpone a meeting to a future date':",
                options: ["Cancel", "Reschedule", "Convene", "Dismiss"],
                correctAnswer: 1,
                explanation: "'Reschedule' means to change the time or date of a planned event, whereas 'Cancel' means to call it off entirely."
            },
            {
                id: "q-be-15",
                question: "If a project is officially reported as 'on track', what does this statement imply?",
                options: [
                    "The project is delayed and in trouble",
                    "The project is progressing well according to the planned schedule",
                    "The project has been cancelled",
                    "The project is over budget"
                ],
                correctAnswer: 1,
                explanation: "If a project is 'on track' (đúng tiến độ), it means everything is going according to plan and targets are expected to be met on time."
            }
        ]
    },
    {
        id: "exam-highschool",
        title: "Ngữ Pháp Tiếng Anh THPT & Ôn Thi Tốt Nghiệp",
        subject: "Tiếng Anh",
        duration: 20,
        passScore: 50,
        difficulty: "Trung bình",
        description: "Bài luyện tập bám sát cấu trúc đề thi THPT Quốc gia bao gồm phát âm, trọng âm, thì động từ, câu điều kiện, câu bị động và so sánh.",
        questions: [
            {
                id: "q-hs-1",
                question: "Choose the word whose underlined part is pronounced differently from the others: c<u>a</u>t, c<u>a</u>r, <u>a</u>bsolute, <u>a</u>ctive",
                options: ["cat", "car", "absolute", "active"],
                correctAnswer: 1,
                explanation: "The letter 'a' in 'car' is pronounced as /ɑː/ (long open back unrounded vowel), whereas in 'cat', 'absolute', and 'active', it is pronounced as /æ/."
            },
            {
                id: "q-hs-2",
                question: "Choose the word that has a different stress pattern from the other three options:",
                options: ["tutor", "student", "teacher", "career"],
                correctAnswer: 3,
                explanation: "'career' is stressed on the second syllable (/kəˈrɪər/). 'tutor', 'student', and 'teacher' are all stressed on the first syllable."
            },
            {
                id: "q-hs-3",
                question: "Complete the conditional sentence: 'If it _______ heavily tomorrow, we will postpone the football match.'",
                options: ["rains", "will rain", "rained", "rain"],
                correctAnswer: 0,
                explanation: "This is a Conditional Sentence Type 1 (expressing real future possibilities). The 'If' clause takes the Simple Present tense ('rains' for third-person singular)."
            },
            {
                id: "q-hs-4",
                question: "Choose the correct relative pronoun: 'She is the talented girl _______ won the first prize in the national competition.'",
                options: ["whom", "who", "which", "whose"],
                correctAnswer: 1,
                explanation: "The relative pronoun 'who' is used as a subject to refer to people ('the talented girl'). 'whom' is used as an object, 'which' is for things, and 'whose' is for possession."
            },
            {
                id: "q-hs-5",
                question: "Complete the sentence: 'I wish I _______ more free time to study for the upcoming final exam.'",
                options: ["have", "had", "will have", "would have"],
                correctAnswer: 1,
                explanation: "A wish about a present situation requires the Past Simple tense ('had') to show that the situation is unreal or hypothetical."
            },
            {
                id: "q-hs-6",
                question: "Choose the correct preposition: 'The heavy storm prevented the fishermen _______ going out to sea.'",
                options: ["to", "from", "on", "against"],
                correctAnswer: 1,
                explanation: "The verb structure is 'prevent somebody/something from doing something' (ngăn cản ai/cái gì làm việc gì)."
            },
            {
                id: "q-hs-7",
                question: "Identify the correct conjunction: 'She works extremely hard _______ she wants to get a promotion and a high salary.'",
                options: ["although", "because", "but", "so that"],
                correctAnswer: 1,
                explanation: "'because' (bởi vì) introduces a clause of reason. She works hard because she wants a promotion. 'although' indicates contrast, 'but' joins opposites, and 'so that' shows purpose."
            },
            {
                id: "q-hs-8",
                question: "Complete the sentence with the past tense: 'By the time we arrived at the cinema last night, the movie _______.'",
                options: ["started", "starts", "had started", "was starting"],
                correctAnswer: 2,
                explanation: "The clause with 'By the time + simple past' indicates that another action was completed before it, which requires the Past Perfect tense ('had started')."
            },
            {
                id: "q-hs-9",
                question: "Choose the correct passive voice form: 'The historical novel _______ by a famous writer last year.'",
                options: ["wrote", "was written", "is written", "has been written"],
                correctAnswer: 1,
                explanation: "The sentence has a past time marker ('last year'), so it requires the Simple Past Passive structure ('was/were + V3/Ed' -> 'was written' for a singular noun)."
            },
            {
                id: "q-hs-10",
                question: "Complete the sentence: 'Unless you _______ hard every day, you won't pass the rigorous high school graduation exam.'",
                options: ["don't study", "study", "studied", "will study"],
                correctAnswer: 1,
                explanation: "'Unless' means 'If... not' (Trừ khi/Nếu không). Since 'unless' already carries a negative meaning, the verb must be in the affirmative form ('study')."
            },
            {
                id: "q-hs-11",
                question: "Choose the correct superlative comparison: 'He is definitely _______ intelligent student in our entire class.'",
                options: ["more", "intelligentest", "the most", "most"],
                correctAnswer: 2,
                explanation: "For long adjectives (like 'intelligent'), the superlative comparison structure is 'the most + adjective' ('the most intelligent')."
            },
            {
                id: "q-hs-12",
                question: "Choose the correct verb form: 'We decided _______ out for a walk despite the cold weather.'",
                options: ["going", "to go", "go", "went"],
                correctAnswer: 1,
                explanation: "The verb 'decide' is followed by a to-infinitive ('decide to do something' -> quyết định làm gì)."
            },
            {
                id: "q-hs-13",
                question: "Complete the conditional sentence: 'If I _______ in your shoes, I would accept that amazing job offer.'",
                options: ["am", "were", "had been", "would be"],
                correctAnswer: 1,
                explanation: "This is a Conditional Sentence Type 2 (unreal present condition). The 'If' clause uses 'were' for all subjects in formal grammar."
            },
            {
                id: "q-hs-14",
                question: "Fill in the blank: 'I haven't seen my childhood friend _______ we graduated from high school.'",
                options: ["for", "since", "during", "ago"],
                correctAnswer: 1,
                explanation: "'since' (từ khi) is used before a starting point in the past (usually a past simple clause) in Present Perfect sentences. 'for' is used for a duration of time."
            },
            {
                id: "q-hs-15",
                question: "Select the word that is closest in meaning (synonym) to 'Difficult':",
                options: ["Easy", "Hard", "Simple", "Pleasant"],
                correctAnswer: 1,
                explanation: "'Hard' is a direct synonym of 'Difficult' (khó khăn). 'Easy' and 'Simple' are opposites (antonyms)."
            }
        ]
    },
    {
        id: "exam-it-english",
        title: "Tiếng Anh Chuyên Ngành Công Nghệ Thông Tin (IT)",
        subject: "Tiếng Anh",
        duration: 15,
        passScore: 60,
        difficulty: "Khó",
        description: "Thuật ngữ chuyên ngành IT, hệ thống phần cứng, quy trình phát triển phần mềm, cơ sở dữ liệu và lập trình bằng Tiếng Anh.",
        questions: [
            {
                id: "q-it-1",
                question: "In computer hardware terminology, what is the full spelling of the acronym 'RAM'?",
                options: [
                    "Read Access Memory",
                    "Random Access Memory",
                    "Row Active Module",
                    "Rate Allocation Mode"
                ],
                correctAnswer: 1,
                explanation: "'RAM' stands for Random Access Memory, which is the volatile primary memory of a computer system used for temporary data storage."
            },
            {
                id: "q-it-2",
                question: "In software engineering, what does the term 'bug' typically refer to?",
                options: [
                    "An actual insect inside the computer tower",
                    "An error, flaw, or fault in a software program that causes it to behave unexpectedly",
                    "A backup copy of data files",
                    "A tool used to compile source code"
                ],
                correctAnswer: 1,
                explanation: "A 'bug' is a coding error or defect in a computer program that prevents it from running correctly or causes crash issues."
            },
            {
                id: "q-it-3",
                question: "Select the phrase that is a synonym of 'to upload' in web applications:",
                options: [
                    "To download data to local storage",
                    "To transfer files or data from a local device to a remote server",
                    "To delete files permanently",
                    "To refresh the web page"
                ],
                correctAnswer: 1,
                explanation: "To upload means to send or transmit data from a local computer or client device to a remote server over a network connection."
            },
            {
                id: "q-it-4",
                question: "What is the technical meaning of the term 'Database'?",
                options: [
                    "A base plate where the computer sits",
                    "A structured and organized collection of data stored electronically in a system",
                    "A programming language used for styling webs",
                    "A network cable connecting computers"
                ],
                correctAnswer: 1,
                explanation: "A database (CSDL) is a systematic, structured collection of organized data, typically managed by a Database Management System (DBMS)."
            },
            {
                id: "q-it-5",
                question: "Which verb describes the process of 'securing data by converting plain text into a scrambled unreadable code'?",
                options: ["Decrypt", "Encrypt", "Decompress", "Format"],
                correctAnswer: 1,
                explanation: "To encrypt (mã hoá) is to convert sensitive data into cipher-text to prevent unauthorized access. Decrypt (giải mã) is the reverse process."
            },
            {
                id: "q-it-6",
                question: "In networking terminology, what does the word 'bandwidth' measure?",
                options: [
                    "The physical width of a network cable",
                    "The maximum capacity or rate of data transfer across a network connection in a given time",
                    "The electrical voltage of server racks",
                    "The weight of a router device"
                ],
                correctAnswer: 1,
                explanation: "Bandwidth (băng thông) refers to the transmission capacity of a communication channel, measured in bits per second (bps)."
            },
            {
                id: "q-it-7",
                question: "What is the primary function of a software program called a 'compiler'?",
                options: [
                    "To browse websites on the internet",
                    "To translate high-level source code written by programmers into low-level machine code that a CPU can execute",
                    "To scan and clean viruses from the system",
                    "To design graphical user interfaces"
                ],
                correctAnswer: 1,
                explanation: "A compiler (trình biên dịch) is a utility program that translates high-level programming language code (like C++ or Java) into executable binary machine code."
            },
            {
                id: "q-it-8",
                question: "What is the correct full spelling of the web acronym 'URL'?",
                options: [
                    "Uniform Resource Locator",
                    "United Registry Link",
                    "Universal Record Locator",
                    "Unique Resource List"
                ],
                correctAnswer: 0,
                explanation: "'URL' stands for Uniform Resource Locator (Đường dẫn định vị tài nguyên thống nhất), which serves as the address of a web resource."
            },
            {
                id: "q-it-9",
                question: "What does the term 'open-source software' signify?",
                options: [
                    "Software that has no security firewall protection",
                    "Software whose source code is freely available to the public to inspect, modify, and distribute",
                    "Software that only runs when connected to the internet",
                    "Software owned entirely by Microsoft"
                ],
                correctAnswer: 1,
                explanation: "Open-source software (phần mềm mã nguồn mở) is software distributed under a license that grants users the right to study, change, and improve its source code."
            },
            {
                id: "q-it-10",
                question: "In web development, what does the term 'backend' typically refer to?",
                options: [
                    "The background image of a website",
                    "The server-side database and application logic that runs behind the scenes",
                    "The computer monitor casing",
                    "The keyboard shortcut keys"
                ],
                correctAnswer: 1,
                explanation: "The 'backend' represents the server-side architecture, processing, APIs, and databases, in contrast to the 'frontend' which represents the user interface."
            },
            {
                id: "q-it-11",
                question: "What does 'computational power' mean in a hardware review context?",
                options: [
                    "The electric power consumption of a computer",
                    "The processing speed and capacity of a computer system to perform calculations and data tasks",
                    "The volume of the computer fan noise",
                    "The size of the computer screen"
                ],
                correctAnswer: 1,
                explanation: "Computational power (hiệu năng tính toán) is the ability of a CPU or hardware rig to perform arithmetic operations, logic, and data processing rapidly."
            },
            {
                id: "q-it-12",
                question: "Choose the correct preposition: 'The active database is securely stored _______ the solid-state drive (SSD).'",
                options: ["in", "on", "at", "by"],
                correctAnswer: 1,
                explanation: "We use the preposition 'on' when referring to data saved on physical storage media or drives ('on the hard drive', 'on the SSD')."
            },
            {
                id: "q-it-13",
                question: "What is the direct vocabulary antonym of the action verb 'to install'?",
                options: ["To delete", "To uninstall", "To update", "To backup"],
                correctAnswer: 1,
                explanation: "To 'uninstall' (gỡ cài đặt) is to remove a software application from a storage drive. To install is to put it onto the drive."
            },
            {
                id: "q-it-14",
                question: "What is the primary operational goal of a network 'firewall'?",
                options: [
                    "To cool down server processors using water pipes",
                    "To prevent unauthorized access or malicious traffic from entering a private network",
                    "To speed up internet loading times",
                    "To compile source code into machine code"
                ],
                correctAnswer: 1,
                explanation: "A firewall (tường lửa) monitors incoming and outgoing network traffic, blocking unauthorized packets based on pre-defined security rules."
            },
            {
                id: "q-it-15",
                question: "What does 'responsive web design' mean in frontend design frameworks?",
                options: [
                    "A design that loads instantly within 0.1 seconds",
                    "A design layout that automatically adapts and looks perfect on different screen sizes and devices",
                    "A website that has automated chatbot responses",
                    "A website protected by advanced encryptions"
                ],
                correctAnswer: 1,
                explanation: "Responsive web design (thiết kế web đáp ứng) ensures that layout grids, images, and CSS fluidly adapt across mobile phones, tablets, and wide monitors."
            }
        ]
    },
    {
        id: "exam-dynasty",
        title: "Lịch Sử Các Triều Đại Phong Kiến Việt Nam",
        subject: "Lịch sử",
        duration: 15,
        passScore: 50,
        difficulty: "Khó",
        description: "Kiểm tra kiến thức sâu rộng về các mốc khởi nghĩa vĩ đại, dời đô lịch sử, võ công oanh liệt chống ngoại xâm thời vương triều Đinh, Lý, Trần, Lê, Tây Sơn.",
        questions: [
            {
                id: "q-dy-1",
                question: "Vị hoàng đế nào đã khai sáng ra vương triều nhà Lý vào năm 1009, thay thế nhà Tiền Lê?",
                options: [
                    "Lý Công Uẩn (Lý Thái Tổ)",
                    "Lý Nhân Tông",
                    "Lý Thường Kiệt",
                    "Lý Thánh Tông"
                ],
                correctAnswer: 0,
                explanation: "Lý Công Uẩn lên ngôi hoàng đế vào tháng 11 năm 1009 (niên hiệu Lý Thái Tổ), khai sáng vương triều Lý kéo dài hơn 200 năm."
            },
            {
                id: "q-dy-2",
                question: "Sự kiện lịch sử trọng đại Lý Thái Tổ viết Chiếu dời đô từ Hoa Lư (Ninh Bình) về Đại La (Thăng Long) diễn ra vào năm nào?",
                options: ["Năm 1009", "Năm 1010", "Năm 1054", "Năm 1225"],
                correctAnswer: 1,
                explanation: "Năm Canh Tuất 1010, Lý Thái Tổ quyết định dời đô từ Hoa Lư chật hẹp về thành Đại La và đổi tên thành Thăng Long (Hà Nội ngày nay)."
            },
            {
                id: "q-dy-3",
                question: "Vị hoàng đế anh minh nào của nhà Lý đã chính thức đặt quốc hiệu nước ta là 'Đại Việt' vào năm 1054?",
                options: ["Lý Thái Tổ", "Lý Thánh Tông", "Lý Thái Tông", "Lý Nhân Tông"],
                correctAnswer: 1,
                explanation: "Năm Giáp Ngọ 1054, ngay sau khi lên ngôi, vua Lý Thánh Tông đã đổi tên nước từ Đại Cồ Việt thành Đại Việt."
            },
            {
                id: "q-dy-4",
                question: "Ai là tác giả bài thơ thần 'Nam quốc sơn hà' vang lên bên sông Như Nguyệt, được coi là bản Tuyên ngôn Độc lập đầu tiên của nước ta?",
                options: ["Lý Công Uẩn", "Lý Thường Kiệt", "Trần Hưng Đạo", "Nguyễn Trãi"],
                correctAnswer: 1,
                explanation: "Tương truyền, Thái úy Lý Thường Kiệt đã viết hoặc đọc bài thơ này để khích lệ tinh thần quân sĩ đánh tan quân Tống xâm lược trên phòng tuyến sông Như Nguyệt."
            },
            {
                id: "q-dy-5",
                question: "Vương triều nhà Trần được thành lập cuối năm 1225 sau khi vị nữ hoàng cuối cùng của nhà Lý nhường ngôi. Bà là ai?",
                options: ["Lý Chiêu Hoàng", "Ỷ Lan Nguyên phi", "Dương Vân Nga", "Ngọc Hân Công chúa"],
                correctAnswer: 0,
                explanation: "Lý Chiêu Hoàng là vị hoàng đế thứ 9 và cũng là vị vua cuối cùng nhà Lý, bà đã nhường ngôi cho chồng là Trần Cảnh (Trần Thái Tông) lập ra nhà Trần."
            },
            {
                id: "q-dy-6",
                question: "Quân và dân vương triều nhà Trần đã trải qua bao nhiêu lần kháng chiến thắng lợi chống quân xâm lược Mông - Nguyên?",
                options: ["1 lần", "2 lần", "3 lần", "4 lần"],
                correctAnswer: 2,
                explanation: "Nhà Trần đã lập chiến công oanh liệt 3 lần đánh bại quân xâm lược Mông - Nguyên hùng mạnh vào các năm 1258, 1285, và 1287-1288 dưới sự lãnh đạo của các vua Trần và Hưng Đạo Vương Trần Quốc Tuấn."
            },
            {
                id: "q-dy-7",
                question: "Hội nghị Diên Hồng lịch sử tập hợp các vị bô lão để trưng cầu dân ý hỏi về việc 'Đánh hay Hòa' diễn ra vào thời triều đại phong kiến nào?",
                options: ["Nhà Lý", "Nhà Trần", "Nhà Hậu Lê", "Nhà Nguyễn"],
                correctAnswer: 1,
                explanation: "Hội nghị Diên Hồng do Thượng hoàng Trần Thánh Tông triệu tập năm 1284 tại điện Diên Hồng để trưng cầu dân ý các bô lão trước hiểm họa giặc Nguyên xâm lược."
            },
            {
                id: "q-dy-8",
                question: "Triều đại phong kiến ngắn nhất trong lịch sử Việt Nam (chỉ kéo dài vỏn vẹn 7 năm) gắn liền sự kiện cải cách kinh tế, xã hội là triều đại nào?",
                options: ["Nhà Hồ", "Nhà Tiền Lê", "Nhà Tây Sơn", "Nhà Mạc"],
                correctAnswer: 0,
                explanation: "Triều đại nhà Hồ do Hồ Quý Ly thành lập năm 1400 sau khi soán ngôi nhà Trần, và sụp đổ vào năm 1407 khi bị quân Minh xâm lược."
            },
            {
                id: "q-dy-9",
                question: "Ai là người anh hùng dũng mãnh lãnh đạo khởi nghĩa Lam Sơn kéo dài 10 năm ròng rã, quét sạch quân Minh để sáng lập nhà Hậu Lê năm 1428?",
                options: ["Lê Hoàn", "Lê Lợi (Lê Thái Tổ)", "Lê Thánh Tông", "Lê Nhân Tông"],
                correctAnswer: 1,
                explanation: "Lê Lợi phát động khởi nghĩa Lam Sơn (Thanh Hóa) năm 1418, đánh bại quân Minh và lên ngôi hoàng đế vào năm 1428, lấy hiệu Lê Thái Tổ."
            },
            {
                id: "q-dy-10",
                question: "Vị vua anh minh lỗi lạc bậc nhất nhà Hậu Lê đã ban hành Bộ luật Hồng Đức và sáng lập Tao đàn Nhị thập bát Tú là ai?",
                options: ["Lê Thái Tổ", "Lê Thánh Tông", "Lê Hiến Tông", "Lê Thái Tông"],
                correctAnswer: 1,
                explanation: "Lê Thánh Tông (trị vì 1460 - 1497) là một nhà cải cách, nhà văn hóa vĩ đại, đưa quốc gia Đại Việt phát triển rực rỡ đạt tới đỉnh cao thịnh trị phong kiến."
            },
            {
                id: "q-dy-11",
                question: "Bộ luật thành văn toàn diện và tiến bộ bậc nhất thời kỳ phong kiến Việt Nam nhằm bảo vệ chủ quyền và một số quyền lợi phụ nữ có tên là gì?",
                options: ["Hình thư", "Quốc triều hình luật (Luật Hồng Đức)", "Luật Gia Long", "Hình luật nhà Trần"],
                correctAnswer: 1,
                explanation: "Bộ luật Quốc triều hình luật (Luật Hồng Đức) thời Lê Thánh Tông là bộ luật đồ sộ, có nhiều điểm tiến bộ vượt bậc như bảo vệ quyền sở hữu tài sản của phụ nữ."
            },
            {
                id: "q-dy-12",
                question: "Người anh hùng áo vải Nguyễn Huệ sau khi lãnh đạo nghĩa quân Tây Sơn đánh Nam dẹp Bắc đã lên ngôi hoàng đế lấy niên hiệu là gì?",
                options: ["Thái Đức", "Quang Trung", "Cảnh Thịnh", "Gia Long"],
                correctAnswer: 1,
                explanation: "Năm 1788, Nguyễn Huệ lên ngôi hoàng đế tại Phú Xuân (Huế), lấy niên hiệu là Quang Trung để chính danh hành quân ra Bắc đánh đuổi quân Thanh."
            },
            {
                id: "q-dy-13",
                question: "Võ công đại phá 29 vạn quân Thanh oanh liệt cuối thế kỷ 18 gắn liền trận đánh Ngọc Hồi - Đống Đa diễn ra vào mùa xuân năm nào?",
                options: ["Năm 1788", "Năm 1789", "Năm 1792", "Năm 1802"],
                correctAnswer: 1,
                explanation: "Vào mùa xuân năm Kỷ Dậu 1789, hoàng đế Quang Trung chỉ huy cuộc hành quân thần tốc đánh tan quân Thanh xâm lược tại trận Ngọc Hồi - Đống Đa."
            },
            {
                id: "q-dy-14",
                question: "Triều đại phong kiến chính thống cuối cùng cai trị đất nước Việt Nam trước khi chế độ quân chủ sụp đổ là triều đại nào?",
                options: ["Nhà Hậu Lê", "Nhà Tây Sơn", "Nhà Nguyễn", "Nhà Mạc"],
                correctAnswer: 2,
                explanation: "Nhà Nguyễn do Nguyễn Ánh sáng lập năm 1802 là triều đại phong kiến cuối cùng trong lịch sử Việt Nam, kết thúc vào tháng 8 năm 1945."
            },
            {
                id: "q-dy-15",
                question: "Kinh thành Huế - công trình kiến trúc hoàng gia đồ sộ cổ kính của triều Nguyễn được UNESCO vinh danh Di sản Văn hóa Thế giới vào năm nào?",
                options: ["Năm 1990", "Năm 1993", "Năm 1999", "Năm 2003"],
                correctAnswer: 1,
                explanation: "Năm 1993, Quần thể di tích Cố đô Huế chính thức được UNESCO công nhận là Di sản Văn hóa Thế giới đầu tiên của Việt Nam."
            }
        ]
    },
    {
        id: "exam-geography",
        title: "Địa Lý Tự Nhiên & Danh Lam Thắng Cảnh Việt Nam",
        subject: "Lịch sử",
        duration: 12,
        passScore: 50,
        difficulty: "Dễ",
        description: "Học hỏi nhanh địa lý nước nhà: chiều dài bờ biển, biên giới quốc gia, các danh lam thắng cảnh nổi tiếng thế giới của Việt Nam.",
        questions: [
            {
                id: "q-ge-1",
                question: "Đường bờ biển cong hình chữ S uốn lượn trải dài của đất nước Việt Nam có tổng chiều dài bao nhiêu km?",
                options: ["2.030 km", "3.260 km", "4.450 km", "1.650 km"],
                correctAnswer: 1,
                explanation: "Việt Nam có đường bờ biển dài khoảng 3.260 km kéo dài từ Móng Cái (Quảng Ninh) đến Hà Tiên (Kiên Giang) đi qua 28 tỉnh thành."
            },
            {
                id: "q-ge-2",
                question: "Xét về vị trí địa lý tự nhiên, đất nước Việt Nam nằm ở khu vực phía nào của bán đảo Đông Dương?",
                options: ["Phía Tây", "Phía Đông", "Phía Nam", "Khu vực trung tâm"],
                correctAnswer: 1,
                explanation: "Việt Nam nằm ở rìa phía Đông của bán đảo Đông Dương, gần trung tâm khu vực Đông Nam Á."
            },
            {
                id: "q-ge-3",
                question: "Hai quần đảo san hô lớn Hoàng Sa và Trường Sa thuộc chủ quyền thiêng liêng của Việt Nam nằm ở vùng biển nào?",
                options: ["Vịnh Bắc Bộ", "Biển Đông", "Vịnh Thái Lan", "Biển Hoa Nam"],
                correctAnswer: 1,
                explanation: "Cả hai quần đảo Hoàng Sa (thuộc thành phố Đà Nẵng) và Trường Sa (thuộc tỉnh Khánh Hòa) đều nằm ở trung tâm Biển Đông rộng lớn."
            },
            {
                id: "q-ge-4",
                question: "Vùng vựa lúa trù phú Đồng bằng sông Cửu Long của nước ta được bồi đắp chủ yếu bởi phù sa của dòng sông quốc tế nào?",
                options: ["Sông Hồng", "Sông Mê Kông", "Sông Đồng Nai", "Sông Đà"],
                correctAnswer: 1,
                explanation: "Sông Mê Kông chảy qua nhiều quốc gia trước khi đổ vào Việt Nam chia thành 9 cửa sông (Sông Cửu Long) bồi đắp lượng phù sa khổng lồ cho đồng bằng."
            },
            {
                id: "q-ge-5",
                question: "Vịnh biển thơ mộng tuyệt đẹp nào của Việt Nam đã vinh dự được tổ chức UNESCO hai lần công nhận là Di sản Thiên nhiên Thế giới?",
                options: ["Vịnh Lăng Cô", "Vịnh Hạ Long", "Vịnh Nha Trang", "Vịnh Xuân Đài"],
                correctAnswer: 1,
                explanation: "Vịnh Hạ Long (Quảng Ninh) được UNESCO công nhận là Di sản thiên nhiên thế giới lần 1 năm 1994 về giá trị thẩm mỹ, và lần 2 năm 2000 về địa chất địa mạo."
            },
            {
                id: "q-ge-6",
                question: "Hồ Ba Bể - hồ nước ngọt tự nhiên trên núi độc đáo và lớn nhất Việt Nam nằm trên địa bàn trực thuộc của tỉnh nào?",
                options: ["Tuyên Quang", "Bắc Kạn", "Cao Bằng", "Lạng Sơn"],
                correctAnswer: 1,
                explanation: "Hồ Ba Bể nằm ở trung tâm Vườn quốc gia Ba Bể, trực thuộc huyện Ba Bể, tỉnh Bắc Kạn, được hình thành từ kiến tạo địa chất đặc biệt."
            },
            {
                id: "q-ge-7",
                question: "Trong số các quốc gia láng giềng, quốc gia nào có đường ranh giới biên giới trên đất liền dài nhất với Việt Nam?",
                options: ["Trung Quốc", "Lào", "Campuchia", "Thái Lan"],
                correctAnswer: 1,
                explanation: "Đường biên giới trên đất liền giữa Việt Nam và Lào dài nhất, khoảng 2.161 km. Tiếp theo là biên giới với Campuchia (khoảng 1.228 km) và Trung Quốc (khoảng 1.281 km)."
            },
            {
                id: "q-ge-8",
                question: "Điểm cực Bắc phần đất liền cực kỳ nổi tiếng của lãnh thổ Việt Nam thuộc địa phận xã Lũng Cú, huyện Đồng Văn của tỉnh nào?",
                options: ["Hà Giang", "Lào Cai", "Cao Bằng", "Lai Châu"],
                correctAnswer: 0,
                explanation: "Cực Bắc Việt Nam nằm ở vĩ độ 23°23'B tại xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang (cột cờ Lũng Cú kiêu hãnh)."
            },
            {
                id: "q-ge-9",
                question: "Quần đảo du lịch có đảo cát lớn nhất Việt Nam bao gồm các vịnh biển đẹp và vườn quốc gia bảo tồn biển đảo là quần đảo nào?",
                options: ["Côn Đảo", "Cát Bà", "Phú Quốc", "Cô Tô"],
                correctAnswer: 1,
                explanation: "Quần đảo Cát Bà nằm ở Hải Phòng gồm 367 đảo nhỏ, trong đó có đảo Cát Bà là đảo cát lớn nhất vịnh Bắc Bộ với đa dạng sinh học vô cùng cao."
            },
            {
                id: "q-ge-10",
                question: "Tỉnh thành nào hiện đang sở hữu diện tích địa lý tự nhiên lớn nhất cả nước Việt Nam?",
                options: ["Thanh Hóa", "Nghệ An", "Đắk Lắk", "Gia Lai"],
                correctAnswer: 1,
                explanation: "Tỉnh Nghệ An có diện tích lớn nhất Việt Nam, khoảng 16.490 km². Tỉnh nhỏ nhất là Bắc Ninh, khoảng 822 km²."
            },
            {
                id: "q-ge-11",
                question: "Dãy núi đèo hiểm trở nào đâm ngang ra biển được coi là ranh giới tự nhiên phân chia khí hậu giữa hai miền Nam và Bắc Việt Nam?",
                options: ["Dãy Hoàng Liên Sơn", "Dãy Bạch Mã (Đèo Hải Vân)", "Dãy Trường Sơn Nam", "Dãy Tam Điệp"],
                correctAnswer: 1,
                explanation: "Dãy Bạch Mã đâm ngang ra biển tạo nên đèo Hải Vân hùng vĩ, cản gió mùa Đông Bắc lạnh tràn xuống miền Nam, làm ranh giới tự nhiên giữa 2 miền khí hậu."
            },
            {
                id: "q-ge-12",
                question: "Kỳ quan động Phong Nha - Kẻ Bàng với những khối thạch nhũ lung linh nổi tiếng thuộc di sản thiên nhiên thế giới của tỉnh nào?",
                options: ["Quảng Trị", "Quảng Bình", "Thừa Thiên Huế", "Nghệ An"],
                correctAnswer: 1,
                explanation: "Vườn quốc gia Phong Nha - Kẻ Bàng nằm ở huyện Bố Trạch và Minh Hóa, tỉnh Quảng Bình, nổi tiếng với hệ thống hang động karst cổ xưa kỳ vĩ."
            },
            {
                id: "q-ge-13",
                question: "Đặc điểm khí hậu tự nhiên nổi bật và bao trùm toàn bộ phần lớn lãnh thổ của đất nước Việt Nam là gì?",
                options: ["Khí hậu ôn đới hải dương", "Khí hậu nhiệt đới ẩm gió mùa", "Khí hậu cận nhiệt đới khô", "Khí hậu xích đạo ẩm"],
                correctAnswer: 1,
                explanation: "Nước ta có khí hậu nhiệt đới ẩm gió mùa do nằm hoàn toàn trong vùng nội chí tuyến Bắc bán cầu và chịu ảnh hưởng mạnh mẽ của gió mùa thổi qua biển."
            },
            {
                id: "q-ge-14",
                question: "Hòn đảo xinh đẹp có biệt danh là 'Đảo Ngọc' và cũng là đảo có diện tích lớn nhất của Việt Nam hiện nay là đảo nào?",
                options: ["Đảo Cát Bà", "Đảo Phú Quốc", "Đảo Lý Sơn", "Đảo Bạch Long Vĩ"],
                correctAnswer: 1,
                explanation: "Phú Quốc nằm trong vịnh Thái Lan thuộc tỉnh Kiên Giang là đảo lớn nhất nước ta, có tiềm năng du lịch nghỉ dưỡng đẳng cấp thế giới."
            },
            {
                id: "q-ge-15",
                question: "Sông Hồng đổ ra biển Đông chủ yếu bằng cửa sông chính nào nằm ở ranh giới hai tỉnh Thái Bình và Nam Định?",
                options: ["Cửa Soài Rạp", "Cửa Ba Lạt", "Cửa Lạch Giang", "Cửa Thái Bình"],
                correctAnswer: 1,
                explanation: "Cửa Ba Lạt là cửa biển nơi dòng sông Hồng đổ ra vịnh Bắc Bộ sau khi chảy xuyên suốt dọc miền Bắc Việt Nam."
            }
        ]
    },
    {
        id: "exam-revolution",
        title: "Lịch Sử Cách Mạng Giải Phóng Dân Tộc Việt Nam",
        subject: "Lịch sử",
        duration: 15,
        passScore: 60,
        difficulty: "Khó",
        description: "Lịch sử đấu tranh cứu nước hào hùng của nhân dân ta chống ách thực dân Pháp và đế quốc Mỹ xâm lược dưới sự lãnh đạo của Đảng.",
        questions: [
            {
                id: "q-rv-1",
                question: "Người thanh niên yêu nước Nguyễn Tất Thành (Chủ tịch Hồ Chí Minh) đã ra đi tìm đường cứu nước tại Bến Nhà Rồng vào ngày tháng năm nào?",
                options: ["Ngày 5/6/1911", "Ngày 2/9/1945", "Ngày 3/2/1930", "Ngày 19/5/1890"],
                correctAnswer: 0,
                explanation: "Ngày 5 tháng 6 năm 1911, trên con tàu Amiral Latouche-Tréville, người thanh niên Nguyễn Tất Thành đã rời bến cảng Nhà Rồng (Sài Gòn) bắt đầu hành trình tìm đường cứu nước."
            },
            {
                id: "q-rv-2",
                question: "Đảng Cộng sản Việt Nam chính thức được thành lập vào ngày tháng năm nào tại Hội nghị Hương Cảng (Trung Quốc) do Nguyễn Ái Quốc chủ trì?",
                options: ["Ngày 19/8/1945", "Ngày 3/2/1930", "Ngày 22/12/1944", "Ngày 2/9/1945"],
                correctAnswer: 1,
                explanation: "Hội nghị hợp nhất các tổ chức cộng sản diễn ra từ ngày 6/1/1930 đến ngày 7/2/1930 tại Hương Cảng dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc. Đảng quyết định chọn ngày 3/2 làm ngày kỷ niệm thành lập Đảng."
            },
            {
                id: "q-rv-3",
                question: "Mặt trận Việt Minh (Việt Nam Độc lập Đồng minh) tập hợp sức mạnh toàn dân được thành lập tại Hội nghị Trung ương 8 (Pác Bó, Cao Bằng) vào năm nào?",
                options: ["Năm 1930", "Năm 1941", "Năm 1944", "Năm 1945"],
                correctAnswer: 1,
                explanation: "Tháng 5 năm 1941, tại Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng do Nguyễn Ái Quốc chủ trì tại Pác Bó, Mặt trận Việt Minh chính thức được thành lập nhằm đoàn kết mọi lực lượng chống Pháp - Nhật."
            },
            {
                id: "q-rv-4",
                question: "Đội Việt Nam Tuyên truyền Giải phóng quân - tổ chức tiền thân cốt lõi của Quân đội Nhân dân Việt Nam được thành lập vào năm nào?",
                options: ["Năm 1930", "Năm 1944", "Năm 1945", "Năm 1954"],
                correctAnswer: 1,
                explanation: "Ngày 22 tháng 12 năm 1944, Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập tại khu rừng Trần Hưng Đạo (Cao Bằng) gồm 34 chiến sĩ dưới sự chỉ huy trực tiếp của đồng chí Võ Nguyên Giáp."
            },
            {
                id: "q-rv-5",
                question: "Thành quả cách mạng to lớn nào dẫn tới sự kiện vĩ đại Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại quảng trường Ba Đình ngày 2/9/1945?",
                options: [
                    "Chiến dịch Biên giới Thu Đông 1950",
                    "Thắng lợi oanh liệt của Cách mạng Tháng Tám năm 1945",
                    "Chiến thắng Điện Biên Phủ 1954",
                    "Hiệp định Giơ-ne-vơ lập lại hoà bình"
                ],
                correctAnswer: 1,
                explanation: "Cuộc Tổng khởi nghĩa Cách mạng Tháng Tám năm 1945 thắng lợi đã đập tan xiềng xích nô lệ của thực dân Pháp và phát xít Nhật, thành lập nên nước Việt Nam Dân chủ Cộng hòa."
            },
            {
                id: "q-rv-6",
                question: "Chiến dịch Biên giới Thu Đông phá vỡ phòng tuyến bao vây cách mạng của giặc Pháp khai thông biên giới Việt - Trung diễn ra vào năm nào?",
                options: ["Năm 1946", "Năm 1950", "Năm 1954", "Năm 1968"],
                correctAnswer: 1,
                explanation: "Năm 1950, ta chủ động mở chiến dịch Biên giới nhằm khai thông biên giới Việt - Trung để tiếp nhận viện trợ quốc tế và mở rộng căn cứ địa Việt Bắc."
            },
            {
                id: "q-rv-7",
                question: "Chiến tích bắn rơi nhiều siêu pháo đài bay B-52 lập nên trận 'Điện Biên Phủ trên không' bảo vệ vững chắc bầu trời Hà Nội diễn ra vào năm nào?",
                options: ["Năm 1965", "Năm 1972", "Năm 1973", "Năm 1975"],
                correctAnswer: 1,
                explanation: "Tháng 12 năm 1972, quân và dân miền Bắc (trọng tâm là Hà Nội và Hải Phòng) đập tan cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ trong 12 ngày đêm, buộc Mỹ ký Hiệp định Pa-ri."
            },
            {
                id: "q-rv-8",
                question: "Hiệp định Pa-ri lịch sử buộc quân đội Mỹ rút hoàn toàn quân viễn chinh và đồng minh ra khỏi lãnh thổ Việt Nam được ký kết vào năm nào?",
                options: ["Năm 1954", "Năm 1972", "Năm 1973", "Năm 1975"],
                correctAnswer: 2,
                explanation: "Hiệp định Pa-ri về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết chính thức vào ngày 27 tháng 1 năm 1973 tại thủ đô nước Pháp."
            },
            {
                id: "q-rv-9",
                question: "Chiến dịch giải phóng Sài Gòn - Gia Định trong cuộc tổng tiến công nổi dậy xuân 1975 được Bộ Chính trị quyết định mang tên chính thức là gì?",
                options: [
                    "Chiến dịch Quảng Trị",
                    "Chiến dịch Hồ Chí Minh",
                    "Chiến dịch Tây Nguyên",
                    "Chiến dịch Huế - Đà Nẵng"
                ],
                correctAnswer: 1,
                explanation: "Ngày 26 tháng 4 năm 1975, chiến dịch giải phóng Sài Gòn chính thức bắt đầu và được vinh dự mang tên Chiến dịch Hồ Chí Minh lịch sử."
            },
            {
                id: "q-rv-10",
                question: "Ngày lịch sử chói lọi đánh dấu giải phóng hoàn toàn miền Nam, thống nhất non sông đất nước Việt Nam độc lập là ngày nào?",
                options: ["Ngày 2/9/1945", "Ngày 30/4/1975", "Ngày 19/8/1945", "Ngày 22/12/1944"],
                correctAnswer: 1,
                explanation: "Trưa ngày 30 tháng 4 năm 1975, xe tăng quân giải phóng húc đổ cổng Dinh Độc Lập, cờ đỏ sao vàng tung bay trên nóc dinh, đánh dấu miền Nam hoàn toàn giải phóng."
            },
            {
                id: "q-rv-11",
                question: "Đại hội đại biểu toàn quốc lần thứ VI của Đảng khởi xướng toàn diện công cuộc Đổi mới đất nước, đưa nước ta hội nhập kinh tế diễn ra vào năm nào?",
                options: ["Năm 1975", "Năm 1986", "Năm 1991", "Năm 1995"],
                correctAnswer: 1,
                explanation: "Tháng 12 năm 1986, Đại hội VI của Đảng họp tại Hà Nội đã thông qua đường lối Đổi mới đất nước toàn diện, đưa đất nước vượt qua khủng hoảng kinh tế xã hội."
            },
            {
                id: "q-rv-12",
                question: "Ai là đồng chí được bầu giữ chức vụ Tổng Bí thư đầu tiên của Đảng Cộng sản Đông Dương vào năm 1930?",
                options: ["Hồ Chí Minh", "Trần Phú", "Lê Duẩn", "Trường Chinh"],
                correctAnswer: 1,
                explanation: "Hội nghị Ban Chấp hành Trung ương lâm thời họp tháng 10 năm 1930 đã bầu đồng chí Trần Phú làm Tổng Bí thư đầu tiên của Đảng và thông qua Luận cương chính trị."
            },
            {
                id: "q-rv-13",
                question: "Tác phẩm lý luận chính trị và cách mạng xuất sắc đầu tiên tập hợp các bài giảng của Nguyễn Ái Quốc xuất bản năm 1927 có tên là gì?",
                options: ["Bản án chế độ thực dân Pháp", "Đường Kách mệnh", "Tuyên ngôn Độc lập", "Nhật ký trong tù"],
                correctAnswer: 1,
                explanation: "'Đường Kách mệnh' là cuốn sách tập hợp các bài giảng của Nguyễn Ái Quốc tại lớp huấn luyện cán bộ ở Quảng Châu, đóng vai trò huấn luyện lý luận cách mạng vô cùng to lớn."
            },
            {
                id: "q-rv-14",
                question: "Thắng lợi quân sự vĩ đại nào của ta đã trực tiếp và hoàn toàn đánh dấu sự sụp đổ của chủ nghĩa thực dân cũ của đế quốc Pháp ở Đông Dương?",
                options: [
                    "Chiến dịch Việt Bắc 1947",
                    "Chiến dịch Điện Biên Phủ 1954",
                    "Trận đèo Hải Vân 1949",
                    "Khởi nghĩa Ba Tơ 1945"
                ],
                correctAnswer: 1,
                explanation: "Chiến thắng lịch sử Điện Biên Phủ chấn động địa cầu năm 1954 đã đập tan nỗ lực quân sự cuối cùng của thực dân Pháp, buộc Pháp phải ký Hiệp định Giơ-ne-vơ rút quân về nước."
            },
            {
                id: "q-rv-15",
                question: "Theo Hiệp định Giơ-ne-vơ năm 1954, sông Bến Hải (Cầu Hiền Lương) được chọn làm giới tuyến quân sự tạm thời nằm ở vĩ tuyến bao nhiêu?",
                options: ["Vĩ tuyến 15", "Vĩ tuyến 17", "Vĩ tuyến 20", "Vĩ tuyến 13"],
                correctAnswer: 1,
                explanation: "Hiệp định Giơ-ne-vơ quy định giới tuyến quân sự tạm thời chạy dọc theo vĩ tuyến 17 (sông Bến Hải, Quảng Trị) chia cắt đất nước thành 2 miền Nam - Bắc trước khi tổng tuyển cử."
            }
        ]
    },
    {
        id: "exam-science",
        title: "Kiến Thức Khoa Học & Đời Sống Phổ Thông",
        subject: "Khác",
        duration: 15,
        passScore: 50,
        difficulty: "Dễ",
        description: "Hỏi đáp vui về các kiến thức khoa học tự nhiên, vật lý lý thú, sinh học động vật và địa lý thế giới thông dụng.",
        questions: [
            {
                id: "q-sc-1",
                question: "Hành tinh nào trong Hệ Mặt Trời nằm ở vị trí gần Mặt Trời nhất?",
                options: ["Sao Kim (Venus)", "Sao Thủy (Mercury)", "Trái Đất (Earth)", "Sao Hỏa (Mars)"],
                correctAnswer: 1,
                explanation: "Sao Thủy (Mercury) là hành tinh nhỏ nhất và nằm gần Mặt Trời nhất trong Hệ Mặt Trời (khoảng cách chỉ khoảng 58 triệu km)."
            },
            {
                id: "q-sc-2",
                question: "Công thức hóa học quen thuộc biểu diễn cho cấu trúc của các phân tử nước là gì?",
                options: ["CO2", "H2O", "NaCl", "O2"],
                correctAnswer: 1,
                explanation: "Nước được cấu tạo từ hai nguyên tử Hydro (H) liên kết với một nguyên tử Oxy (O), tạo nên công thức hóa học H2O."
            },
            {
                id: "q-sc-3",
                question: "Loài động vật có vú (mammal) duy nhất nào sở hữu cấu tạo cơ thể có thể bay lượn như chim?",
                options: ["Đà điểu", "Dơi", "Sóc bay", "Cá heo"],
                correctAnswer: 1,
                explanation: "Dơi là loài động vật có vú duy nhất có thể bay lượn thực sự bằng cánh màng (sóc bay chỉ có khả năng lượn từ cao xuống thấp)."
            },
            {
                id: "q-sc-4",
                question: "Chất khí nào chiếm tỷ lệ thể tích lớn nhất (khoảng 78%) bên trong bầu khí quyển Trái Đất?",
                options: ["Khí Oxy", "Khí Nitơ (Nitrogen)", "Khí Carbon dioxide (CO2)", "Khí Argon"],
                correctAnswer: 1,
                explanation: "Bầu khí quyển Trái Đất gồm khoảng 78% khí Nitơ (N2), 21% khí Oxy (O2), và 1% các khí hiếm khác cùng hơi nước."
            },
            {
                id: "q-sc-5",
                question: "Cơ quan nội tạng nào trong cơ thể con người chịu trách nhiệm chính lọc bỏ chất độc trong máu và đào thải nước tiểu?",
                options: ["Gan", "Thận", "Phổi", "Dạ dày"],
                correctAnswer: 1,
                explanation: "Hai quả thận đóng vai trò như nhà máy lọc máu, loại bỏ các chất cặn bã và dư thừa để tạo thành nước tiểu đi xuống bàng quang."
            },
            {
                id: "q-sc-6",
                question: "Vận tốc truyền đi của ánh sáng trong môi trường chân không hoàn hảo xấp xỉ bằng bao nhiêu?",
                options: [
                    "340 mét/giây",
                    "300.000 km/giây",
                    "150.000 km/giờ",
                    "1.000 km/giây"
                ],
                correctAnswer: 1,
                explanation: "Ánh sáng di chuyển trong chân không với tốc độ kỷ lục xấp xỉ 299.792 km/s (thường làm tròn là 300.000 km/s). 340 m/s là tốc độ âm thanh trong không khí."
            },
            {
                id: "q-sc-7",
                question: "Quá trình thực vật sử dụng chất diệp lục hấp thụ năng lượng mặt trời để tổng hợp chất hữu cơ gọi là gì?",
                options: ["Hô hấp tế bào", "Quang hợp", "Thoát hơi nước", "Hấp thụ khoáng"],
                correctAnswer: 1,
                explanation: "Quang hợp (photosynthesis) là quá trình cây xanh sử dụng ánh sáng mặt trời để chuyển đổi nước và khí CO2 thành khí Oxy và đường glucose."
            },
            {
                id: "q-sc-8",
                question: "Cơ thể con người tổng hợp được hàm lượng Vitamin nào dồi dào nhất khi tiếp xúc trực tiếp với tia cực tím của ánh nắng mặt trời buổi sáng?",
                options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
                correctAnswer: 2,
                explanation: "Ánh nắng mặt trời buổi sáng sớm kích thích các tế bào biểu bì da tự tổng hợp nên nguồn Vitamin D tự nhiên rất tốt cho hấp thụ Canxi."
            },
            {
                id: "q-sc-9",
                question: "Nguyên tố kim loại độc đáo nào tồn tại ở thể lỏng ở điều kiện nhiệt độ phòng tiêu chuẩn bình thường?",
                options: ["Sắt", "Thủy ngân (Mercury)", "Chì", "Đồng"],
                correctAnswer: 1,
                explanation: "Thủy ngân (Hg) là kim loại duy nhất ở dạng lỏng trong điều kiện nhiệt độ và áp suất phòng chuẩn, do liên kết nguyên tử yếu."
            },
            {
                id: "q-sc-10",
                question: "Hành tinh nào trong Hệ Mặt Trời được mệnh danh là 'Hành tinh Đỏ' do bề mặt chứa lượng oxit sắt cực lớn tạo màu đỏ đặc trưng?",
                options: ["Sao Mộc", "Sao Hỏa (Mars)", "Sao Thổ", "Sao Thiên Vương"],
                correctAnswer: 1,
                explanation: "Sao Hỏa (Mars) có lớp đất đá phủ đầy bụi Oxit sắt (rỉ sét) tạo nên màu đỏ cam rực rỡ đặc trưng khi quan sát từ xa."
            },
            {
                id: "q-sc-11",
                question: "Đơn vị tiêu chuẩn quốc tế dùng để đo cường độ dòng điện chạy qua dây dẫn trong vật lý là gì?",
                options: ["Vôn (Volt)", "Ampe (Ampere)", "Ohm (Ôm)", "Watt (Oat)"],
                correctAnswer: 1,
                explanation: "Ampe (A) đo cường độ dòng điện. Vôn (V) đo hiệu điện thế, Ôm đo điện trở và Watt (W) đo công suất tiêu thụ điện."
            },
            {
                id: "q-sc-12",
                question: "Nhà vật lý học thiên tài người Đức nào đã phát minh ra Thuyết Tương đối (tương đối rộng và tương đối hẹp)?",
                options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
                correctAnswer: 1,
                explanation: "Albert Einstein đã đề xuất Thuyết tương đối hẹp (1905) và Thuyết tương đối rộng (1915), làm thay đổi căn bản góc nhìn vật lý hiện đại."
            },
            {
                id: "q-sc-13",
                question: "Lực vô hình hút tất cả vật chất về phía tâm Trái Đất và giữ các hành tinh quay quanh quỹ đạo Mặt Trời gọi là gì?",
                options: ["Lực ma sát", "Lực vạn vật hấp dẫn", "Lực ly tâm", "Lực đẩy Ác-si-mét"],
                correctAnswer: 1,
                explanation: "Lực hấp dẫn (Gravity) là lực hút giữa mọi vật có khối lượng, được Isaac Newton phát hiện và Einstein giải thích sâu hơn."
            },
            {
                id: "q-sc-14",
                question: "Nhóm máu nào được y học định nghĩa là 'nhóm máu chuyên cho' (có thể truyền an toàn cho người mang tất cả các nhóm máu khác)?",
                options: ["Nhóm máu A", "Nhóm máu B", "Nhóm máu AB", "Nhóm máu O"],
                correctAnswer: 3,
                explanation: "Người mang nhóm máu O (đặc biệt O âm) không có kháng nguyên A hay B trên hồng cầu, nên có thể truyền an toàn cho bất kỳ ai mà không bị hệ miễn dịch từ chối đào thải."
            },
            {
                id: "q-sc-15",
                question: "Thành phố sầm uất bậc nhất châu Á nào hiện đang đóng vai trò là thủ đô chính thức của đất nước Nhật Bản?",
                options: ["Kyoto", "Tokyo", "Osaka", "Seoul"],
                correctAnswer: 1,
                explanation: "Tokyo là thủ đô hành chính hiện tại của Nhật Bản. Kyoto là cố đô cũ của đất nước này, và Seoul là thủ đô của Hàn Quốc."
            }
        ]
    }
];
