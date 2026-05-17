/* ==========================================================================
   QUIZFLOW DASHBOARD SYSTEM CONTROLLER
   State Initialization, Performance Metrics, Filter Systems, & Dynamic Views.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. STATE INITIALIZATION
    const currentUser = Students.getCurrentUser();
    if (!currentUser) return; // Route guard will handle redirect

    // Display admin navigation link if role permits (admin and teacher)
    if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
        const adminBtn = document.getElementById('nav-admin');
        if (adminBtn) adminBtn.style.display = 'inline-block';
    }

    // Load active settings in forms
    const inputName = document.getElementById('input-profile-name');
    if (inputName) inputName.value = currentUser.name;

    let state = {
        exams: [],
        attempts: [],
        activeSubject: 'all',
        searchQuery: ''
    };

    // Load exams library
    const localExams = localStorage.getItem('quizflow_exams');
    if (!localExams) {
        state.exams = DEFAULT_EXAMS;
        localStorage.setItem('quizflow_exams', JSON.stringify(DEFAULT_EXAMS));
    } else {
        state.exams = JSON.parse(localExams);
    }

    // Load attempts history
    const localAttempts = localStorage.getItem('quizflow_attempts');
    state.attempts = localAttempts ? JSON.parse(localAttempts) : [];

    // Filter attempts to only show those of the current user
    function getStudentAttempts() {
        return state.attempts.filter(att => att.username.toLowerCase() === currentUser.username.toLowerCase());
    }

    // --- 2. DOM INTERFACE SELECTORS ---
    const DOM = {
        greeting: document.getElementById('dashboard-greeting'),
        statCompleted: document.getElementById('stat-total-completed'),
        statAvgScore: document.getElementById('stat-avg-score'),
        statPassRate: document.getElementById('stat-pass-rate'),
        statTime: document.getElementById('stat-total-time'),
        tabs: document.querySelectorAll('.tab-btn'),
        searchInput: document.getElementById('search-exam-input'),
        examBadge: document.getElementById('exam-count-badge'),
        badge: document.getElementById('exam-count-badge'), // Safe-guard duplicate selector
        examContainer: document.getElementById('exam-list-container'),
        historyTable: document.getElementById('history-table-body'),
        noHistoryPlaceholder: document.getElementById('no-history-placeholder'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        
        // Profile Modal
        profileTrigger: document.getElementById('profile-widget-trigger'),
        profileDropdown: document.getElementById('profile-dropdown-content'),
        saveProfileBtn: document.getElementById('save-profile-btn'),
        avatarOpts: document.querySelectorAll('.avatar-opt')
    };

    // --- 3. UI RENDERING CORE ---

    // Personalized Greeting
    function updateGreeting() {
        const hour = new Date().getHours();
        let prefix = "Chào bạn";
        if (hour < 12) prefix = "Chào buổi sáng";
        else if (hour < 18) prefix = "Chào buổi chiều";
        else prefix = "Chào buổi tối";
        
        if (DOM.greeting) {
            DOM.greeting.innerHTML = `${prefix}, <span class="text-gradient">${currentUser.name}!</span>`;
        }
    }

    // Performance statistics
    function renderStats() {
        const isTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';
        
        // Dynamically adjust labels for teacher role
        if (isTeacher) {
            const labels = document.querySelectorAll('.stats-grid .stat-label');
            if (labels.length >= 4) {
                labels[0].textContent = "Thí Sinh Hoàn Thành";
                labels[1].textContent = "Điểm Số Trung Bình";
                labels[2].textContent = "Tỉ Lệ Sinh Viên Đạt";
                labels[3].textContent = "Thời Gian Làm Bài TB";
            }
        }

        const attemptsToUse = isTeacher ? state.attempts : getStudentAttempts();
        const total = attemptsToUse.length;
        DOM.statCompleted.textContent = total;

        if (total === 0) {
            DOM.statAvgScore.innerHTML = `0.0<span class="stat-sub">%</span>`;
            DOM.statPassRate.innerHTML = `0<span class="stat-sub">%</span>`;
            DOM.statTime.innerHTML = `0<span class="stat-sub">phút</span>`;
            return;
        }

        // Average score
        const totalScore = attemptsToUse.reduce((acc, curr) => acc + curr.scorePercentage, 0);
        const avg = (totalScore / total).toFixed(1);
        DOM.statAvgScore.innerHTML = `${avg}<span class="stat-sub">%</span>`;

        // Pass rate
        const passes = attemptsToUse.filter(att => att.passed).length;
        const passRate = Math.round((passes / total) * 100);
        DOM.statPassRate.innerHTML = `${passRate}<span class="stat-sub">%</span>`;

        // Total/Average time spent
        const totalSecs = attemptsToUse.reduce((acc, curr) => acc + curr.timeSpent, 0);
        const timeToDisplay = isTeacher ? Math.round((totalSecs / total) / 60) : Math.round(totalSecs / 60);
        DOM.statTime.innerHTML = `${timeToDisplay}<span class="stat-sub">phút</span>`;
    }

    // Dynamic rendering of exam list
    function renderExams() {
        DOM.examContainer.innerHTML = '';
        
        const filtered = state.exams.filter(exam => {
            const matchesSubject = state.activeSubject === 'all' || exam.subject === state.activeSubject;
            const matchesSearch = exam.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                                  exam.description.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesSubject && matchesSearch;
        });

        DOM.badge.textContent = `${filtered.length} đề thi`;

        if (filtered.length === 0) {
            DOM.examContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>Không tìm thấy đề thi trắc nghiệm nào phù hợp với từ khóa.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(exam => {
            const card = document.createElement('div');
            card.className = 'exam-card';
            
            let difficultyClass = 'diff-medium';
            if (exam.difficulty === 'Dễ') difficultyClass = 'diff-easy';
            if (exam.difficulty === 'Khó') difficultyClass = 'diff-hard';

            let subjectIcon = 'fa-laptop';
            if (exam.subject === 'Tiếng Anh') subjectIcon = 'fa-language';
            if (exam.subject === 'Lịch sử') subjectIcon = 'fa-landmark';
            if (exam.subject === 'Khác') subjectIcon = 'fa-cubes';

            // Get attempt status
            const myAttempts = getStudentAttempts();
            const hasAttempted = myAttempts.some(att => att.examId === exam.id);
            const statusBadge = hasAttempted 
                ? `<span style="font-size: 11px; font-weight: 700; color: var(--success); display: inline-flex; align-items: center; gap: 4px; background-color: var(--success-light); padding: 4px 8px; border-radius: var(--radius-sm); margin-left: auto;"><i class="fa-solid fa-circle-check"></i> Đã làm</span>`
                : `<span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px; background-color: var(--bg-secondary); padding: 4px 8px; border-radius: var(--radius-sm); margin-left: auto;"><i class="fa-regular fa-circle"></i> Chưa làm</span>`;

            card.innerHTML = `
                <div class="exam-card-header" style="display: flex; align-items: center; width: 100%;">
                    <span class="exam-card-subject">
                        <i class="fa-solid ${subjectIcon}"></i> ${exam.subject}
                    </span>
                    <span class="exam-card-difficulty ${difficultyClass}" style="margin-left: 8px;">${exam.difficulty}</span>
                    ${statusBadge}
                </div>
                <h3 class="exam-card-title">${exam.title}</h3>
                <p class="exam-card-desc">${exam.description || 'Không có mô tả cho đề thi này.'}</p>
                <div class="exam-card-meta">
                    <span class="meta-item"><i class="fa-solid fa-clock"></i> ${exam.duration} phút</span>
                    <span class="meta-item"><i class="fa-solid fa-circle-question"></i> ${exam.questions.length} câu hỏi</span>
                </div>
                <button class="btn btn-primary btn-full btn-start-exam" data-id="${exam.id}">
                    Bắt Đầu Làm Bài &nbsp;<i class="fa-solid fa-play"></i>
                </button>
            `;

            DOM.examContainer.appendChild(card);
        });

        // Wire up starting buttons
        document.querySelectorAll('.btn-start-exam').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const selected = state.exams.find(e => e.id === id);
                if (selected) {
                    if (selected.questions.length === 0) {
                        showToast("Đề thi này chưa có câu hỏi nào! Vui lòng chọn đề khác.", "error");
                        return;
                    }
                    
                    // Check date/time schedule limits
                    const now = new Date();
                    if (selected.startDate) {
                        const start = new Date(selected.startDate);
                        if (now < start) {
                            showToast(`Đề thi này chưa mở! Thời gian bắt đầu: ${start.toLocaleString('vi-VN')}`, "warning");
                            return;
                        }
                    }
                    if (selected.endDate) {
                        const end = new Date(selected.endDate);
                        if (now > end) {
                            showToast(`Kỳ thi này đã kết thúc vào lúc: ${end.toLocaleString('vi-VN')}`, "error");
                            return;
                        }
                    }

                    if (confirm(`Bạn muốn bắt đầu thi bài "${selected.title}"? Thời gian làm bài là ${selected.duration} phút.`)) {
                        localStorage.setItem('quizflow_active_exam_id', id);
                        window.location.href = 'trangcon/exam.html';
                    }
                }
            });
        });
    }

    // Dynamic rendering of student attempt history
    function renderHistory() {
        DOM.historyTable.innerHTML = '';
        
        const isTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';
        
        // Dynamically adjust headers and layout for teachers
        const historyTitle = document.querySelector('.history-section .section-title');
        const theadRow = document.querySelector('.history-table thead tr');
        
        if (isTeacher) {
            if (historyTitle) {
                historyTitle.innerHTML = `<i class="fa-solid fa-ranking-star"></i> Danh Sách Sinh Viên Làm Bài Thi`;
            }
            if (DOM.clearHistoryBtn) {
                DOM.clearHistoryBtn.style.display = 'none'; // Hide personal history clear button for teacher
            }
            if (theadRow) {
                theadRow.innerHTML = `
                    <th>STT</th>
                    <th>Họ Tên Thí Sinh</th>
                    <th>Đề Thi</th>
                    <th>Ngày Làm</th>
                    <th>Thời Gian Làm</th>
                    <th>Điểm Số</th>
                    <th>Đánh Giá</th>
                    <th>Hành Động</th>
                `;
            }
            const placeholderText = DOM.noHistoryPlaceholder.querySelector('p');
            if (placeholderText) {
                placeholderText.textContent = "Chưa có sinh viên nào tham gia thi trắc nghiệm trên hệ thống.";
            }
        }

        const attemptsToUse = isTeacher ? state.attempts : getStudentAttempts();

        if (attemptsToUse.length === 0) {
            DOM.noHistoryPlaceholder.style.display = 'flex';
            document.querySelector('.history-table').style.display = 'none';
            return;
        }

        DOM.noHistoryPlaceholder.style.display = 'none';
        document.querySelector('.history-table').style.display = 'table';

        // Copy array for display reversing
        const renderList = [...attemptsToUse].reverse();

        renderList.forEach((attempt, index) => {
            const tr = document.createElement('tr');
            
            const dateStr = new Date(attempt.takenAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });

            const durationStr = `${Math.floor(attempt.timeSpent / 60)} phút ${attempt.timeSpent % 60} giây`;
            const evaluationBadge = attempt.passed ? 
                `<span class="badge badge-success"><i class="fas fa-check-circle"></i> Đạt</span>` : 
                `<span class="badge badge-danger"><i class="fas fa-times-circle"></i> Chưa Đạt</span>`;

            if (isTeacher) {
                tr.innerHTML = `
                    <td><strong>${index + 1}</strong></td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);"><i class="fas fa-user-graduate"></i> &nbsp; ${attempt.username}</div>
                    </td>
                    <td class="history-exam-title" style="font-weight: 500;">${attempt.examTitle}</td>
                    <td>${dateStr}</td>
                    <td>${durationStr}</td>
                    <td>
                        <span class="color-primary" style="font-weight:700;">${attempt.scorePercentage}%</span>
                        <div style="font-size: 11px; color: var(--text-muted);">${attempt.correctCount}/${attempt.totalQuestions} câu đúng</div>
                    </td>
                    <td>${evaluationBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-review-result" data-id="${attempt.id}">
                            <i class="fa-solid fa-eye"></i> Chi Tiết
                        </button>
                    </td>
                `;
            } else {
                tr.innerHTML = `
                    <td><strong>${index + 1}</strong></td>
                    <td class="history-exam-title">${attempt.examTitle}</td>
                    <td>${dateStr}</td>
                    <td>${durationStr}</td>
                    <td>
                        <div style="font-weight: 600;">${attempt.scorePercentage}%</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${attempt.correctCount}/${attempt.totalQuestions} câu đúng</div>
                    </td>
                    <td>${evaluationBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-review-result" data-id="${attempt.id}">
                            <i class="fa-solid fa-eye"></i> Xem Lại
                        </button>
                    </td>
                `;
            }

            DOM.historyTable.appendChild(tr);
        });

        // Wire up review buttons
        document.querySelectorAll('.btn-review-result').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                localStorage.setItem('quizflow_review_attempt_id', id);
                window.location.href = 'trangcon/result.html';
            });
        });
    }

    // --- 4. PROFILE SETTINGS HANDLER ---
    // Profile dropdown toggling is handled globally in auth.js to avoid conflicts across pages.

    // Avatar selections
    let activeAvatar = currentUser.avatar;
    DOM.avatarOpts.forEach(opt => {
        // Init active state
        if (opt.getAttribute('data-avatar') === activeAvatar) {
            DOM.avatarOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        }

        opt.addEventListener('click', () => {
            DOM.avatarOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            activeAvatar = opt.getAttribute('data-avatar');
        });
    });

    // Save profile changes
    if (DOM.saveProfileBtn) {
        DOM.saveProfileBtn.addEventListener('click', () => {
            const nameInput = inputName.value.trim();
            if (!nameInput) {
                showToast("Tên hiển thị không được bỏ trống!", "error");
                return;
            }

            const res = Students.updateProfile(nameInput, activeAvatar);
            if (res.success) {
                showToast("Cập nhật thông tin thành công!", "success");
                
                // Update navigation elements
                const headerAvatar = document.getElementById('user-avatar-preview');
                const headerName = document.getElementById('user-name-preview');
                if (headerAvatar) headerAvatar.className = `fas fa-${res.user.avatar}`;
                if (headerName) headerName.textContent = res.user.name;
                
                currentUser.name = res.user.name;
                currentUser.avatar = res.user.avatar;

                updateGreeting();
                DOM.profileDropdown.classList.remove('show');
                DOM.profileDropdown.classList.remove('active');
                DOM.profileDropdown.style.display = 'none';
            }
        });
    }

    // --- 5. SEARCH AND TABS HANDLERS ---
    
    // Tab filters
    DOM.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.activeSubject = tab.getAttribute('data-subject');
            renderExams();
        });
    });

    // Search query
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderExams();
        });
    }

    // Clear history logs for active student
    if (DOM.clearHistoryBtn) {
        DOM.clearHistoryBtn.addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn muốn xoá toàn bộ lịch sử làm bài của riêng bạn? Hành động này không thể hoàn tác.")) {
                // Remove only active student's records from global list
                const filteredAttempts = state.attempts.filter(att => att.username.toLowerCase() !== currentUser.username.toLowerCase());
                state.attempts = filteredAttempts;
                localStorage.setItem('quizflow_attempts', JSON.stringify(filteredAttempts));
                
                renderStats();
                renderHistory();
                showToast("Đã xóa lịch sử làm bài thành công!", "success");
            }
        });
    }

    // --- 6. THEME TOGGLE CONTROLLER ---
    
    // Initialize theme state
    const savedTheme = localStorage.getItem('quizflow_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('quizflow_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Đã chuyển sang giao diện ${newTheme === 'dark' ? 'Tối' : 'Sáng'}!`, "info");
        });
    }

    function updateThemeIcon(theme) {
        if (!DOM.themeToggle) return;
        const icon = DOM.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // --- 7. TOAST NOTIFICATION UTILITY ---
    function showToast(message, type = "info") {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.4s forwards';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // --- 7.5 DYNAMIC ROOM CODE CHAMBER (ROLE-BASED) ---
    const codeEntryCard = document.querySelector('.code-entry-card');
    if (codeEntryCard) {
        const isTeacherOrAdmin = currentUser.role === 'admin' || currentUser.role === 'teacher';
        if (isTeacherOrAdmin) {
            // Render Teacher/Admin Room Code Generator
            let optionsHTML = '<option value="">-- Chọn bài kiểm tra --</option>';
            state.exams.forEach(exam => {
                optionsHTML += `<option value="${exam.id}">${exam.title} (${exam.subject})</option>`;
            });

            codeEntryCard.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 46px; height: 46px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.1); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: var(--shadow-inset);">
                                <i class="fa-solid fa-circle-plus"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Tạo Mã Phòng Thi Đặc Quyền</h3>
                                <p style="font-size: 13px; color: var(--text-secondary);">Chọn đề thi để tạo mã phòng thi gồm 5 ký tự ngẫu nhiên cung cấp cho học viên.</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                            <select id="select-exam-room" style="padding: 12px 16px; font-size: 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background-color: var(--bg-primary); color: var(--text-primary); outline: none; width: 250px; cursor: pointer; font-weight: 600;">
                                ${optionsHTML}
                            </select>
                            <button class="btn btn-primary" id="btn-generate-room-code" style="padding: 12px 24px; background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);">
                                <i class="fa-solid fa-bolt"></i> &nbsp; Tạo Mã Phòng
                            </button>
                        </div>
                    </div>
                    <!-- Target for displaying generated code -->
                    <div id="generated-code-display-area" style="display: none; width: 100%;"></div>
                </div>
            `;

            // Wire up event listener for generating code
            const btnGenerate = document.getElementById('btn-generate-room-code');
            const selectExam = document.getElementById('select-exam-room');
            const displayArea = document.getElementById('generated-code-display-area');

            if (btnGenerate && selectExam && displayArea) {
                btnGenerate.addEventListener('click', () => {
                    const examId = selectExam.value;
                    if (!examId) {
                        showToast("Vui lòng chọn bài kiểm tra trước khi tạo mã phòng!", "warning");
                        return;
                    }

                    const selectedExam = state.exams.find(e => e.id === examId);
                    if (!selectedExam) return;

                    // Generate a random 5-character alphanumeric uppercase code (avoiding confusing chars like I, O, 0, 1)
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    let code = '';
                    for (let i = 0; i < 5; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }

                    // Save active room inside localStorage
                    const activeRooms = JSON.parse(localStorage.getItem('quizflow_active_rooms') || '[]');
                    
                    // Filter out old room codes for the same exam to prevent duplicate room mappings
                    const cleanRooms = activeRooms.filter(r => r.examId !== examId && r.code !== code);
                    cleanRooms.push({
                        code: code,
                        examId: examId,
                        examTitle: selectedExam.title,
                        createdAt: new Date().toISOString()
                    });

                    localStorage.setItem('quizflow_active_rooms', JSON.stringify(cleanRooms));

                    // Show success display
                    displayArea.innerHTML = `
                        <div style="padding: 14px 20px; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; animation: dropdownFade 0.3s ease;">
                            <span style="font-size: 13px; color: #10b981; font-weight: 600;">
                                <i class="fa-solid fa-circle-check"></i> Phòng thi đã mở! Hãy chia sẻ mã này cho học sinh để làm bài <strong>"${selectedExam.title}"</strong>:
                            </span>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 22px; font-weight: 800; color: #10b981; letter-spacing: 3px; font-family: monospace; background: rgba(16, 185, 129, 0.15); padding: 4px 12px; border-radius: 6px; box-shadow: var(--shadow-sm);">${code}</span>
                                <button class="btn btn-sm" id="btn-copy-room-code" data-code="${code}" style="padding: 8px 14px; font-size: 12px; font-weight: 600; background: #10b981; color: #fff; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                                    <i class="fa-solid fa-copy"></i> Sao chép
                                </button>
                            </div>
                        </div>
                    `;
                    displayArea.style.display = 'block';
                    showToast(`Tạo mã phòng ${code} thành công!`, "success");

                    // Wire up copy button
                    const btnCopy = document.getElementById('btn-copy-room-code');
                    if (btnCopy) {
                        btnCopy.addEventListener('click', () => {
                            navigator.clipboard.writeText(code).then(() => {
                                btnCopy.innerHTML = `<i class="fa-solid fa-check"></i> Đã chép`;
                                showToast("Đã sao chép mã phòng vào clipboard!", "success");
                                setTimeout(() => {
                                    btnCopy.innerHTML = `<i class="fa-solid fa-copy"></i> Sao chép`;
                                }, 2000);
                            });
                        });
                    }
                });
            }
        } else {
            // It's a student, keep regular student logic but upgrade the join handler to support both static codes and dynamic active rooms!
            const inputExamCode = document.getElementById('input-exam-code');
            const btnEnterByCode = document.getElementById('btn-enter-by-code');

            if (btnEnterByCode && inputExamCode) {
                // Clear any old event listeners by replacing with a clone
                const newBtn = btnEnterByCode.cloneNode(true);
                btnEnterByCode.parentNode.replaceChild(newBtn, btnEnterByCode);

                newBtn.addEventListener('click', () => {
                    const code = inputExamCode.value.trim().toUpperCase();
                    if (code.length !== 5) {
                        showToast("Mã đề thi phải bao gồm đúng 5 ký tự!", "warning");
                        return;
                    }

                    // 1. First search in dynamic active rooms created by teachers
                    const activeRooms = JSON.parse(localStorage.getItem('quizflow_active_rooms') || '[]');
                    const matchedRoom = activeRooms.find(r => r.code === code);

                    let matchedExam = null;
                    if (matchedRoom) {
                        matchedExam = state.exams.find(e => e.id === matchedRoom.examId);
                    } else {
                        // 2. Fallback search static code in state.exams
                        matchedExam = state.exams.find(e => e.examCode && e.examCode.toUpperCase() === code);
                    }

                    if (matchedExam) {
                        if (matchedExam.questions.length === 0) {
                            showToast("Đề thi này chưa có câu hỏi nào! Vui lòng liên hệ Giáo viên.", "error");
                            return;
                        }

                        // Check schedule timing limits
                        const now = new Date();
                        if (matchedExam.startDate) {
                            const start = new Date(matchedExam.startDate);
                            if (now < start) {
                                showToast(`Đề thi này chưa mở! Thời gian bắt đầu: ${start.toLocaleString('vi-VN')}`, "warning");
                                return;
                            }
                        }
                        if (matchedExam.endDate) {
                            const end = new Date(matchedExam.endDate);
                            if (now > end) {
                                showToast(`Kỳ thi này đã kết thúc vào lúc: ${end.toLocaleString('vi-VN')}`, "error");
                                return;
                            }
                        }

                        showToast(`Đã tìm thấy đề thi: ${matchedExam.title}! Chuẩn bị vào thi...`, "success");
                        setTimeout(() => {
                            localStorage.setItem('quizflow_active_exam_id', matchedExam.id);
                            window.location.href = 'trangcon/exam.html';
                        }, 1000);
                    } else {
                        showToast("Mã phòng thi không tồn tại hoặc đã hết hạn!", "error");
                    }
                });

                // Add Enter key event listener to input
                inputExamCode.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        newBtn.click();
                    }
                });
            }
        }
    }

    // --- 8. PAGE INITS ---
    updateGreeting();
    renderStats();
    renderExams();
    renderHistory();
});
