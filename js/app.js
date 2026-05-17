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
        const myAttempts = getStudentAttempts();
        const total = myAttempts.length;
        DOM.statCompleted.textContent = total;

        if (total === 0) {
            DOM.statAvgScore.innerHTML = `0.0<span class="stat-sub">%</span>`;
            DOM.statPassRate.innerHTML = `0<span class="stat-sub">%</span>`;
            DOM.statTime.innerHTML = `0<span class="stat-sub">phút</span>`;
            return;
        }

        // Average score
        const totalScore = myAttempts.reduce((acc, curr) => acc + curr.scorePercentage, 0);
        const avg = (totalScore / total).toFixed(1);
        DOM.statAvgScore.innerHTML = `${avg}<span class="stat-sub">%</span>`;

        // Pass rate
        const passes = myAttempts.filter(att => att.passed).length;
        const passRate = Math.round((passes / total) * 100);
        DOM.statPassRate.innerHTML = `${passRate}<span class="stat-sub">%</span>`;

        // Total time
        const totalSecs = myAttempts.reduce((acc, curr) => acc + curr.timeSpent, 0);
        const totalMins = Math.round(totalSecs / 60);
        DOM.statTime.innerHTML = `${totalMins}<span class="stat-sub">phút</span>`;
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
        const myAttempts = getStudentAttempts();

        if (myAttempts.length === 0) {
            DOM.noHistoryPlaceholder.style.display = 'flex';
            document.querySelector('.history-table').style.display = 'none';
            return;
        }

        DOM.noHistoryPlaceholder.style.display = 'none';
        document.querySelector('.history-table').style.display = 'table';

        myAttempts.reverse().forEach((attempt, index) => {
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

    // --- 7.5 EXAM CODE ENTRY CHAMBER ---
    const inputExamCode = document.getElementById('input-exam-code');
    const btnEnterByCode = document.getElementById('btn-enter-by-code');

    if (btnEnterByCode && inputExamCode) {
        btnEnterByCode.addEventListener('click', () => {
            const code = inputExamCode.value.trim().toUpperCase();
            if (code.length !== 5) {
                showToast("Mã đề thi phải bao gồm đúng 5 ký tự!", "warning");
                return;
            }

            // Search exams in state.exams
            const matched = state.exams.find(e => e.examCode && e.examCode.toUpperCase() === code);
            if (matched) {
                if (matched.questions.length === 0) {
                    showToast("Đề thi này chưa có câu hỏi nào! Vui lòng liên hệ Admin.", "error");
                    return;
                }

                // Check schedule timing limits
                const now = new Date();
                if (matched.startDate) {
                    const start = new Date(matched.startDate);
                    if (now < start) {
                        showToast(`Đề thi này chưa mở! Thời gian bắt đầu: ${start.toLocaleString('vi-VN')}`, "warning");
                        return;
                    }
                }
                if (matched.endDate) {
                    const end = new Date(matched.endDate);
                    if (now > end) {
                        showToast(`Kỳ thi này đã kết thúc vào lúc: ${end.toLocaleString('vi-VN')}`, "error");
                        return;
                    }
                }

                showToast(`Đã tìm thấy đề thi: ${matched.title}! Chuẩn bị vào thi...`, "success");
                setTimeout(() => {
                    localStorage.setItem('quizflow_active_exam_id', matched.id);
                    window.location.href = 'trangcon/exam.html';
                }, 1000);
            } else {
                showToast("Mã đề thi không tồn tại hoặc đã bị gỡ bỏ!", "error");
            }
        });

        // Add Enter key event listener
        inputExamCode.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnEnterByCode.click();
            }
        });
    }

    // --- 8. PAGE INITS ---
    updateGreeting();
    renderStats();
    renderExams();
    renderHistory();
});
