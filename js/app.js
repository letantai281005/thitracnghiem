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
            const isTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';
            const myAttempts = getStudentAttempts();
            const hasAttempted = myAttempts.some(att => att.examId === exam.id);
            const statusBadge = hasAttempted 
                ? `<span style="font-size: 11px; font-weight: 700; color: var(--success); display: inline-flex; align-items: center; gap: 4px; background-color: var(--success-light); padding: 4px 8px; border-radius: var(--radius-sm); margin-left: auto;"><i class="fa-solid fa-circle-check"></i> Đã làm</span>`
                : `<span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px; background-color: var(--bg-secondary); padding: 4px 8px; border-radius: var(--radius-sm); margin-left: auto;"><i class="fa-regular fa-circle"></i> Chưa làm</span>`;

            const btnText = isTeacher ? 'Tạo Phòng Thi' : 'Bắt Đầu Làm Bài';
            const btnIcon = isTeacher ? 'fa-circle-plus' : 'fa-play';
            const btnGradientStyle = isTeacher ? 'background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);' : '';

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
                <button class="btn btn-primary btn-full btn-start-exam" data-id="${exam.id}" style="${btnGradientStyle}">
                    ${btnText} &nbsp;<i class="fa-solid ${btnIcon}"></i>
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
                    const isTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';
                    if (isTeacher) {
                        // Teacher action: Auto-select this exam in room generator and scroll up beautifully
                        const selectRoom = document.getElementById('select-exam-room');
                        if (selectRoom) {
                            selectRoom.value = id;
                            const codeCard = document.querySelector('.code-entry-card');
                            if (codeCard) {
                                codeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                codeCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                                codeCard.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
                                codeCard.style.borderColor = '#10b981';
                                setTimeout(() => {
                                    codeCard.style.boxShadow = 'var(--shadow-sm)';
                                    codeCard.style.borderColor = 'var(--border-color)';
                                }, 2500);
                            }
                            showToast(`Đã chọn đề: "${selected.title}" để tạo mã phòng!`, "success");
                        } else {
                            showToast("Không tìm thấy bộ tạo mã phòng!", "error");
                        }
                        return;
                    }

                    // Student action
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
                    <th>Phân Loại</th>
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
                // Find student's actual properties from registration database
                const users = typeof Students !== 'undefined' ? Students.getAll() : [];
                const foundUser = users.find(u => u.username.toLowerCase() === attempt.username.toLowerCase());
                const studentFullName = foundUser ? foundUser.name : attempt.username;
                const studentClass = foundUser && foundUser.studentType ? foundUser.studentType : 'học sinh';

                let classBadgeStyle = 'background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3);';
                let classIcon = 'fa-graduation-cap';
                
                if (studentClass.toLowerCase() === 'sinh viên') {
                    classBadgeStyle = 'background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3);';
                    classIcon = 'fa-university';
                }

                tr.innerHTML = `
                    <td><strong>${index + 1}</strong></td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);"><i class="fas fa-user-graduate"></i> &nbsp; ${studentFullName}</div>
                        <div style="font-size: 11px; color: var(--text-muted); padding-left: 20px;">@${attempt.username}</div>
                    </td>
                    <td>
                        <span class="badge" style="${classBadgeStyle} text-transform: capitalize; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="fa-solid ${classIcon}"></i> ${studentClass}
                        </span>
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

    // --- 7.4 LIVE MONITOR MONITORING CHAMBER ENGINE ---
    let monitorIntervalId = null;

    function startLiveRoomMonitor(code) {
        // Clear any existing monitor interval
        if (monitorIntervalId) clearInterval(monitorIntervalId);
        
        const displayArea = document.getElementById('generated-code-display-area');
        if (!displayArea) return;
        
        // Add the live monitor container if not already added
        let monitorCard = document.getElementById('live-room-monitor');
        if (!monitorCard) {
            monitorCard = document.createElement('div');
            monitorCard.id = 'live-room-monitor';
            monitorCard.style.cssText = 'margin-top: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.015); padding: 20px; box-shadow: var(--shadow-sm); animation: dropdownFade 0.3s ease;';
            displayArea.parentNode.appendChild(monitorCard);
        }
        
        // Define simple style keyframe for pulse green if not exist
        if (!document.getElementById('pulse-green-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-green-style';
            style.innerText = `
                @keyframes pulse-green {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; }
                    100% { opacity: 0.4; }
                }
            `;
            document.head.appendChild(style);
        }
        
        function refreshMonitorData() {
            const candidates = JSON.parse(localStorage.getItem('quizflow_room_candidates') || '[]');
            const roomCandidates = candidates.filter(c => c.roomCode.toUpperCase() === code.toUpperCase());
            
            monitorCard.innerHTML = `
                <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <span style="display: inline-flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-satellite-dish" style="color: #10b981; animation: pulse-green 1.5s infinite;"></i> 
                        Giám Sát Phòng Thi Live (Mã Phòng: <span style="color: #10b981; font-family: monospace; font-weight: 800; font-size: 17px; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px;">${code}</span>)
                    </span>
                    <span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">
                        <i class="fa-solid fa-user-group"></i> Sĩ số: <strong>${roomCandidates.length}</strong> thí sinh
                    </span>
                </h4>
            `;
            
            if (roomCandidates.length === 0) {
                monitorCard.innerHTML += `
                    <div style="text-align: center; padding: 24px 0; color: var(--text-muted); font-size: 13px;">
                        <i class="fa-solid fa-spinner fa-spin" style="margin-bottom: 8px; font-size: 18px; color: #10b981;"></i>
                        <p>Đang đợi học sinh nhập mã để vào phòng thi...</p>
                    </div>
                `;
                return;
            }
            
            let tableRowsHTML = '';
            roomCandidates.forEach((c, idx) => {
                const joinedTime = new Date(c.joinedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                let statusBadge = '';
                let scoreDisplay = '';
                
                if (c.status === 'finished') {
                    statusBadge = `<span class="badge badge-success" style="padding: 4px 8px; border-radius: 4px;"><i class="fa-solid fa-circle-check"></i> Đã Nộp Bài</span>`;
                    scoreDisplay = `<strong style="color: var(--primary); font-size: 14px;">${c.score}%</strong>`;
                } else {
                    statusBadge = `<span class="badge badge-warning" style="padding: 4px 8px; border-radius: 4px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);"><i class="fa-solid fa-pencil fa-spin"></i> Đang Làm Bài</span>`;
                    scoreDisplay = `<span style="color: var(--text-muted); font-style: italic; font-size: 12px;">Đang làm...</span>`;
                }
                
                let classBadgeStyle = 'background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3);';
                let classIcon = 'fa-graduation-cap';
                if (c.studentType && c.studentType.toLowerCase() === 'sinh viên') {
                    classBadgeStyle = 'background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3);';
                    classIcon = 'fa-university';
                }
                
                tableRowsHTML += `
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <td style="padding: 10px 8px; font-weight: 700;">${idx + 1}</td>
                        <td style="padding: 10px 8px; font-weight: 600; color: var(--text-primary);">${c.name} <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">(@${c.username})</span></td>
                        <td style="padding: 10px 8px;">
                            <span class="badge" style="${classBadgeStyle} text-transform: capitalize; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                <i class="fa-solid ${classIcon}"></i> ${c.studentType || 'học sinh'}
                            </span>
                        </td>
                        <td style="padding: 10px 8px; color: var(--text-secondary); font-size: 12px;">${joinedTime}</td>
                        <td style="padding: 10px 8px;">${statusBadge}</td>
                        <td style="padding: 10px 8px; text-align: center;">${scoreDisplay}</td>
                    </tr>
                `;
            });
            
            monitorCard.innerHTML += `
                <div class="table-responsive" style="overflow-x: auto; margin-top: 8px;">
                    <table class="history-table" style="width: 100%; border-collapse: collapse; display: table !important;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                                <th style="padding: 8px;">STT</th>
                                <th style="padding: 8px;">Họ Tên Thí Sinh</th>
                                <th style="padding: 8px;">Phân Loại</th>
                                <th style="padding: 8px;">Giờ Vào Phòng</th>
                                <th style="padding: 8px;">Trạng Thái</th>
                                <th style="padding: 8px; text-align: center;">Điểm Thi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        refreshMonitorData();
        monitorIntervalId = setInterval(refreshMonitorData, 1500);
    }

    // --- 7.5 DYNAMIC ROOM CODE CHAMBER (ROLE-BASED) ---
    // Inject styles for premium countdown overlay
    if (!document.getElementById('quizflow-countdown-styles')) {
        const style = document.createElement('style');
        style.id = 'quizflow-countdown-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(1.02); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function showCountdownOverlay(room, exam, startTime) {
        const existing = document.getElementById('quizflow-countdown-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'quizflow-countdown-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(10, 15, 30, 0.96);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            animation: fadeIn 0.4s ease-out;
        `;

        const glassContainer = document.createElement('div');
        glassContainer.style.cssText = `
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 40px;
            width: 90%;
            max-width: 580px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
        `;

        const lightGlow = document.createElement('div');
        lightGlow.style.cssText = `
            position: absolute;
            top: -150px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
            pointer-events: none;
            z-index: 0;
        `;
        glassContainer.appendChild(lightGlow);

        const iconDiv = document.createElement('div');
        iconDiv.innerHTML = `<i class="fa-solid fa-hourglass-half" style="font-size: 48px; color: #6366f1; animation: spin-slow 8s linear infinite;"></i>`;
        iconDiv.style.cssText = `
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        `;
        glassContainer.appendChild(iconDiv);

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `z-index: 1;`;
        infoDiv.innerHTML = `
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #818cf8; letter-spacing: 2px; background: rgba(99, 102, 241, 0.15); padding: 4px 12px; border-radius: 20px;">PHÒNG THI CHỜ KÍCH HOẠT</span>
            <h2 style="font-size: 24px; font-weight: 800; margin: 12px 0 8px 0; background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${exam.title}</h2>
            <div style="display: flex; gap: 16px; justify-content: center; font-size: 13px; color: #94a3b8;">
                <span><i class="fa-solid fa-graduation-cap" style="color: #6366f1;"></i> ${exam.subject}</span>
                <span>•</span>
                <span><i class="fa-solid fa-clock" style="color: #6366f1;"></i> ${exam.duration} phút</span>
                <span>•</span>
                <span><i class="fa-solid fa-file-invoice" style="color: #6366f1;"></i> ${exam.questions.length} câu</span>
            </div>
        `;
        glassContainer.appendChild(infoDiv);

        const countdownWrapper = document.createElement('div');
        countdownWrapper.style.cssText = `
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
            z-index: 1;
        `;

        function createDigitBox(label) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            `;
            const box = document.createElement('div');
            box.style.cssText = `
                width: 76px;
                height: 76px;
                border-radius: 16px;
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 800;
                font-family: 'Plus Jakarta Sans', monospace;
                color: #6366f1;
                text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            `;
            const lbl = document.createElement('span');
            lbl.style.cssText = `
                font-size: 11px;
                font-weight: 700;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 1px;
            `;
            lbl.textContent = label;
            wrapper.appendChild(box);
            wrapper.appendChild(lbl);
            return { wrapper, box };
        }

        const hoursBox = createDigitBox("Giờ");
        const minutesBox = createDigitBox("Phút");
        const secondsBox = createDigitBox("Giây");

        countdownWrapper.appendChild(hoursBox.wrapper);
        const colon1 = document.createElement('span');
        colon1.style.cssText = `font-size: 32px; font-weight: 800; color: #475569; margin-bottom: 24px;`;
        colon1.textContent = ":";
        countdownWrapper.appendChild(colon1);
        countdownWrapper.appendChild(minutesBox.wrapper);
        const colon2 = document.createElement('span');
        colon2.style.cssText = `font-size: 32px; font-weight: 800; color: #475569; margin-bottom: 24px;`;
        colon2.textContent = ":";
        countdownWrapper.appendChild(colon2);
        countdownWrapper.appendChild(secondsBox.wrapper);

        glassContainer.appendChild(countdownWrapper);

        const footerDiv = document.createElement('div');
        footerDiv.style.cssText = `z-index: 1; width: 100%;`;
        footerDiv.innerHTML = `
            <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 12px; padding: 14px 20px; font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fa-solid fa-circle-info" style="color: #6366f1;"></i>
                <span>Phòng thi sẽ tự động bắt đầu khi thời gian đếm ngược kết thúc.</span>
            </div>
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.className = "btn btn-outline-danger";
        cancelBtn.style.cssText = `
            width: 100%;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        cancelBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> &nbsp; Hủy và Quay Lại`;
        footerDiv.appendChild(cancelBtn);

        glassContainer.appendChild(footerDiv);
        overlay.appendChild(glassContainer);
        document.body.appendChild(overlay);

        let intervalId = setInterval(() => {
            const now = new Date().getTime();
            const distance = startTime.getTime() - now;

            if (distance <= 0) {
                clearInterval(intervalId);
                overlay.remove();
                
                let candidates = JSON.parse(localStorage.getItem('quizflow_room_candidates') || '[]');
                candidates = candidates.filter(c => !(c.username.toLowerCase() === currentUser.username.toLowerCase() && c.roomCode.toUpperCase() === room.code.toUpperCase()));
                candidates.push({
                    username: currentUser.username,
                    name: currentUser.name,
                    studentType: currentUser.studentType || 'học sinh',
                    roomCode: room.code,
                    examId: exam.id,
                    joinedAt: new Date().toISOString(),
                    status: 'testing',
                    score: null
                });
                localStorage.setItem('quizflow_room_candidates', JSON.stringify(candidates));
                localStorage.setItem('quizflow_active_room_code', room.code);

                showToast(`Phòng thi đã mở! Chúc bạn thi tốt.`, "success");
                setTimeout(() => {
                    localStorage.setItem('quizflow_active_exam_id', exam.id);
                    window.location.href = 'trangcon/exam.html';
                }, 1000);
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            hoursBox.box.textContent = hours.toString().padStart(2, '0');
            minutesBox.box.textContent = minutes.toString().padStart(2, '0');
            secondsBox.box.textContent = seconds.toString().padStart(2, '0');
        }, 1000);

        // Pre-tick instantly
        const nowTick = new Date().getTime();
        const distanceTick = startTime.getTime() - nowTick;
        if (distanceTick > 0) {
            const hours = Math.floor((distanceTick % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distanceTick % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distanceTick % (1000 * 60)) / 1000);
            hoursBox.box.textContent = hours.toString().padStart(2, '0');
            minutesBox.box.textContent = minutes.toString().padStart(2, '0');
            secondsBox.box.textContent = seconds.toString().padStart(2, '0');
        }

        cancelBtn.addEventListener('click', () => {
            clearInterval(intervalId);
            overlay.remove();
            showToast("Đã hủy tham gia phòng thi chờ.", "info");
        });
    }

    const codeEntryCard = document.querySelector('.code-entry-card');
    if (codeEntryCard) {
        const isTeacherOrAdmin = currentUser.role === 'admin' || currentUser.role === 'teacher';
        if (isTeacherOrAdmin) {
            // Render Teacher/Admin Room Code Generator with start time support
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
                                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Tạo Mã Phòng Thi (Giáo Viên)</h3>
                                <p style="font-size: 13px; color: var(--text-secondary);">Giáo viên tạo mã phòng thi và cài đặt thời gian mở bài thực tế.</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <label style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Đề thi trắc nghiệm</label>
                                <select id="select-exam-room" style="padding: 12px 16px; font-size: 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background-color: var(--bg-primary); color: var(--text-primary); outline: none; width: 220px; cursor: pointer; font-weight: 600;">
                                    ${optionsHTML}
                                </select>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <label style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Giờ mở thi (Tùy chọn)</label>
                                <input type="datetime-local" id="input-room-start-time" style="padding: 12px 16px; font-size: 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background-color: var(--bg-primary); color: var(--text-primary); outline: none; width: 220px; cursor: pointer; font-weight: 600;">
                            </div>
                            <button class="btn btn-primary" id="btn-generate-room-code" style="padding: 12px 24px; background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);">
                                <i class="fa-solid fa-bolt"></i> &nbsp; Tạo Mã Phòng (Giáo Viên)
                            </button>
                        </div>
                    </div>
                    <!-- Target for displaying generated code -->
                    <div id="generated-code-display-area" style="display: none; width: 100%;"></div>
                </div>
            `;

            const btnGenerate = document.getElementById('btn-generate-room-code');
            const selectExam = document.getElementById('select-exam-room');
            const startTimeInput = document.getElementById('input-room-start-time');
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

                    const startTimeVal = startTimeInput.value;
                    
                    // Generate a random 5-character alphanumeric uppercase code
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    let code = '';
                    for (let i = 0; i < 5; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }

                    // Save active room inside localStorage
                    const activeRooms = JSON.parse(localStorage.getItem('quizflow_active_rooms') || '[]');
                    const cleanRooms = activeRooms.filter(r => r.examId !== examId && r.code !== code);
                    cleanRooms.push({
                        code: code,
                        examId: examId,
                        examTitle: selectedExam.title,
                        startTime: startTimeVal ? new Date(startTimeVal).toISOString() : null,
                        createdAt: new Date().toISOString()
                    });

                    localStorage.setItem('quizflow_active_rooms', JSON.stringify(cleanRooms));

                    let timeInfoHTML = '';
                    if (startTimeVal) {
                        const startD = new Date(startTimeVal);
                        timeInfoHTML = `<div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 500;"><i class="fa-solid fa-calendar-clock"></i> Bắt đầu thi vào: <strong>${startD.toLocaleString('vi-VN')}</strong></div>`;
                    } else {
                        timeInfoHTML = `<div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 500;"><i class="fa-solid fa-bolt"></i> Có thể vào thi ngay lập tức</div>`;
                    }

                    displayArea.innerHTML = `
                        <div style="padding: 14px 20px; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; animation: dropdownFade 0.3s ease;">
                            <span style="font-size: 13px; color: #10b981; font-weight: 600;">
                                <i class="fa-solid fa-circle-check"></i> Phòng thi đã mở! Hãy chia sẻ mã này cho học sinh để làm bài <strong>"${selectedExam.title}"</strong>:
                                ${timeInfoHTML}
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

                    startLiveRoomMonitor(code);
                });

                // Auto-load live monitor for the most recent active room if it exists
                const activeRooms = JSON.parse(localStorage.getItem('quizflow_active_rooms') || '[]');
                if (activeRooms.length > 0) {
                    const mostRecentRoom = activeRooms[activeRooms.length - 1];
                    selectExam.value = mostRecentRoom.examId;
                    if (mostRecentRoom.startTime) {
                        // Set value locally for visual persistence
                        const localD = new Date(mostRecentRoom.startTime);
                        const formatD = localD.getFullYear() + '-' + 
                                       String(localD.getMonth()+1).padStart(2, '0') + '-' + 
                                       String(localD.getDate()).padStart(2, '0') + 'T' + 
                                       String(localD.getHours()).padStart(2, '0') + ':' + 
                                       String(localD.getMinutes()).padStart(2, '0');
                        startTimeInput.value = formatD;
                    }

                    let timeInfoHTML = '';
                    if (mostRecentRoom.startTime) {
                        const startD = new Date(mostRecentRoom.startTime);
                        timeInfoHTML = `<div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 500;"><i class="fa-solid fa-calendar-clock"></i> Bắt đầu thi vào: <strong>${startD.toLocaleString('vi-VN')}</strong></div>`;
                    } else {
                        timeInfoHTML = `<div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 500;"><i class="fa-solid fa-bolt"></i> Có thể vào thi ngay lập tức</div>`;
                    }
                    
                    displayArea.innerHTML = `
                        <div style="padding: 14px 20px; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; animation: dropdownFade 0.3s ease;">
                            <span style="font-size: 13px; color: #10b981; font-weight: 600;">
                                <i class="fa-solid fa-circle-check"></i> Phòng thi đang mở! Hãy chia sẻ mã này cho học sinh để làm bài <strong>"${mostRecentRoom.examTitle}"</strong>:
                                ${timeInfoHTML}
                            </span>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 22px; font-weight: 800; color: #10b981; letter-spacing: 3px; font-family: monospace; background: rgba(16, 185, 129, 0.15); padding: 4px 12px; border-radius: 6px; box-shadow: var(--shadow-sm);">${mostRecentRoom.code}</span>
                                <button class="btn btn-sm" id="btn-copy-room-code" data-code="${mostRecentRoom.code}" style="padding: 8px 14px; font-size: 12px; font-weight: 600; background: #10b981; color: #fff; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                                    <i class="fa-solid fa-copy"></i> Sao chép
                                </button>
                            </div>
                        </div>
                    `;
                    displayArea.style.display = 'block';
                    
                    const btnCopy = document.getElementById('btn-copy-room-code');
                    if (btnCopy) {
                        btnCopy.addEventListener('click', () => {
                            navigator.clipboard.writeText(mostRecentRoom.code).then(() => {
                                btnCopy.innerHTML = `<i class="fa-solid fa-check"></i> Đã chép`;
                                showToast("Đã sao chép mã phòng vào clipboard!", "success");
                                setTimeout(() => {
                                    btnCopy.innerHTML = `<i class="fa-solid fa-copy"></i> Sao chép`;
                                }, 2000);
                            });
                        });
                    }
                    
                    startLiveRoomMonitor(mostRecentRoom.code);
                }
            }
        } else {
            // It's a student, keep regular student logic but upgrade the join handler to support both static codes and dynamic active rooms!
            const inputExamCode = document.getElementById('input-exam-code');
            const btnEnterByCode = document.getElementById('btn-enter-by-code');

            if (btnEnterByCode && inputExamCode) {
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

                        // Check dynamic scheduled start time from the room
                        if (matchedRoom && matchedRoom.startTime) {
                            const startTime = new Date(matchedRoom.startTime);
                            const now = new Date();
                            if (now < startTime) {
                                // Scheduled start time has not arrived yet! Show visual countdown overlay
                                showCountdownOverlay(matchedRoom, matchedExam, startTime);
                                return;
                            }
                        }

                        // Check static schedule timing limits (if any)
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

                        // Dynamic Room Student Registry registration
                        let candidates = JSON.parse(localStorage.getItem('quizflow_room_candidates') || '[]');
                        candidates = candidates.filter(c => !(c.username.toLowerCase() === currentUser.username.toLowerCase() && c.roomCode.toUpperCase() === code.toUpperCase()));
                        candidates.push({
                            username: currentUser.username,
                            name: currentUser.name,
                            studentType: currentUser.studentType || 'học sinh',
                            roomCode: code,
                            examId: matchedExam.id,
                            joinedAt: new Date().toISOString(),
                            status: 'testing',
                            score: null
                        });
                        localStorage.setItem('quizflow_room_candidates', JSON.stringify(candidates));
                        localStorage.setItem('quizflow_active_room_code', code);

                        showToast(`Đã tìm thấy đề thi: ${matchedExam.title}! Chuẩn bị vào thi...`, "success");
                        setTimeout(() => {
                            localStorage.setItem('quizflow_active_exam_id', matchedExam.id);
                            window.location.href = 'trangcon/exam.html';
                        }, 1000);
                    } else {
                        showToast("Mã phòng thi không tồn tại hoặc đã hết hạn!", "error");
                    }
                });

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
