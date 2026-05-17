/* ==========================================================================
   QUIZFLOW EXAM ENGINE CONTROLLER
   Timer Systems, Interactive Option selectors, Nav Maps & Grade Calculations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SESSION & ENVIRONMENT VALIDATION
    const currentUser = Students.getCurrentUser();
    if (!currentUser) return; // Auth guard handles redirect

    const activeExamId = localStorage.getItem('quizflow_active_exam_id');
    if (!activeExamId) {
        alert("Không tìm thấy thông tin bài thi hoạt động!");
        window.location.href = '../index.html';
        return;
    }

    // Load active exams database
    let exams = [];
    const localExams = localStorage.getItem('quizflow_exams');
    if (localExams) {
        exams = JSON.parse(localExams);
    } else {
        alert("Dữ liệu thư viện đề thi bị lỗi!");
        window.location.href = '../index.html';
        return;
    }

    const exam = exams.find(e => e.id === activeExamId);
    if (!exam) {
        alert("Đề thi này không tồn tại hoặc đã bị xóa!");
        window.location.href = '../index.html';
        return;
    }

    // --- 2. RUNTIME STATE ---
    let state = {
        exam: exam,
        userAnswers: Array(exam.questions.length).fill(null),
        flaggedQuestions: new Set(),
        currentQuestionIndex: 0,
        timeLeft: exam.duration * 60, // Convert minutes to seconds
        timerInterval: null,
        isSubmitted: false
    };

    // --- 3. DOM INTERFACE SELECTORS ---
    const DOM = {
        title: document.getElementById('exam-current-title'),
        subject: document.getElementById('exam-current-subject'),
        timerText: document.getElementById('timer-countdown'),
        timerCircle: document.getElementById('timer-progress-circle'),
        progressBar: document.getElementById('exam-progress-bar'),
        progressText: document.getElementById('exam-progress-text'),
        
        // Question Card
        qIndexLabel: document.getElementById('current-question-index-label'),
        qText: document.getElementById('current-question-text'),
        optionsContainer: document.getElementById('options-list-container'),
        flagBtn: document.getElementById('btn-flag-question'),
        
        // Side navigation map
        mapContainer: document.getElementById('questions-grid-map-container'),
        statTotal: document.getElementById('sidebar-total-q'),
        statAnswered: document.getElementById('sidebar-answered-q'),
        statFlagged: document.getElementById('sidebar-flagged-q'),
        
        // Nav Buttons
        prevBtn: document.getElementById('btn-prev-question'),
        nextBtn: document.getElementById('btn-next-question'),
        flagQuickBtn: document.getElementById('btn-quick-flag'),
        submitBtn: document.getElementById('btn-finalize-exam'),
        emergencySubmitBtn: document.getElementById('btn-emergency-submit'),
        
        // Modal Confirm
        modalConfirm: document.getElementById('modal-submit-confirm'),
        modalCancel: document.getElementById('btn-confirm-cancel'),
        modalSubmit: document.getElementById('btn-confirm-submit'),
        confirmTotal: document.getElementById('confirm-total-q'),
        confirmAnswered: document.getElementById('confirm-answered-q'),
        confirmUnanswered: document.getElementById('confirm-unanswered-q'),
        confirmFlagged: document.getElementById('confirm-flagged-q'),
        
        themeToggle: document.getElementById('theme-toggle')
    };

    // Initialize UI titles
    DOM.title.textContent = exam.title;
    DOM.subject.textContent = exam.subject;
    DOM.statTotal.textContent = exam.questions.length;

    // --- 4. EXAM ENGINE TIMERS ---
    function startTimer() {
        updateTimerDisplay();
        
        state.timerInterval = setInterval(() => {
            state.timeLeft--;
            updateTimerDisplay();

            if (state.timeLeft <= 0) {
                clearInterval(state.timerInterval);
                showToast("Hết giờ làm bài! Hệ thống đang tự động nộp bài thi...", "warning");
                submitExam(true); // Forced submission on timeout
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const mins = Math.floor(state.timeLeft / 60);
        const secs = state.timeLeft % 60;
        
        // Formatted text
        const minsStr = mins.toString().padStart(2, '0');
        const secsStr = secs.toString().padStart(2, '0');
        DOM.timerText.textContent = `${minsStr}:${secsStr}`;

        // SVG Circular countdown stroke calculations
        const totalDuration = exam.duration * 60;
        const pct = (state.timeLeft / totalDuration) * 100;
        const circleStrokeLength = 100; // mapped to stroke-dasharray="100, 100"
        
        if (DOM.timerCircle) {
            DOM.timerCircle.style.strokeDasharray = `${pct}, 100`;
            
            // Add alert colors if below 15% time left
            if (pct < 15) {
                DOM.timerCircle.style.stroke = '#ef4444'; // Red alert
                DOM.timerText.style.color = '#ef4444';
                DOM.timerText.style.animation = 'pulseFade 1s infinite';
            } else if (pct < 40) {
                DOM.timerCircle.style.stroke = '#f59e0b'; // Amber alert
                DOM.timerText.style.color = '#f59e0b';
            }
        }
    }

    // --- 5. RENDER CHOSEN QUESTION ---
    function renderQuestion() {
        const qIdx = state.currentQuestionIndex;
        const q = exam.questions[qIdx];

        // 1. Question details
        DOM.qIndexLabel.textContent = `Câu hỏi ${qIdx + 1}:`;
        DOM.qText.textContent = q.question;

        // 2. Options selector render
        DOM.optionsContainer.innerHTML = '';
        q.options.forEach((optText, index) => {
            const optCard = document.createElement('div');
            optCard.className = 'option-card';
            if (state.userAnswers[qIdx] === index) {
                optCard.classList.add('selected');
            }

            const prefix = String.fromCharCode(65 + index); // A, B, C, D
            optCard.innerHTML = `
                <div class="option-prefix">${prefix}</div>
                <div class="option-text">${optText}</div>
                <div class="option-indicator"><i class="fas fa-check"></i></div>
            `;

            optCard.addEventListener('click', () => {
                selectOption(qIdx, index);
            });

            DOM.optionsContainer.appendChild(optCard);
        });

        // 3. Flag check status in navigation bar
        if (state.flaggedQuestions.has(qIdx)) {
            DOM.flagBtn.innerHTML = `<i class="fa-solid fa-flag"></i> Bỏ đánh dấu`;
            DOM.flagBtn.classList.add('active');
        } else {
            DOM.flagBtn.innerHTML = `<i class="fa-regular fa-flag"></i> Đánh dấu xem lại`;
            DOM.flagBtn.classList.remove('active');
        }

        // 4. Update horizontal progress fills
        const answeredCount = state.userAnswers.filter(a => a !== null).length;
        const progressPct = (answeredCount / exam.questions.length) * 100;
        DOM.progressBar.style.width = `${progressPct}%`;
        DOM.progressText.textContent = `Tiến trình làm bài: ${answeredCount}/${exam.questions.length} câu`;

        // 5. Update nav disabled states
        DOM.prevBtn.disabled = qIdx === 0;
        DOM.nextBtn.disabled = qIdx === exam.questions.length - 1;

        // 6. Refresh side navigation map elements
        updateQuestionMap();
        updateStats();
    }

    function selectOption(qIdx, optionIdx) {
        state.userAnswers[qIdx] = optionIdx;
        renderQuestion(); // Re-render to show selected styled card
    }

    // Toggle Review flags
    function toggleFlag() {
        const qIdx = state.currentQuestionIndex;
        if (state.flaggedQuestions.has(qIdx)) {
            state.flaggedQuestions.delete(qIdx);
            showToast(`Đã bỏ đánh dấu Câu ${qIdx + 1}`, "info");
        } else {
            state.flaggedQuestions.add(qIdx);
            showToast(`Đã đánh dấu Câu ${qIdx + 1} để xem lại`, "warning");
        }
        renderQuestion();
    }

    // --- 6. NAVIGATION MATRICES (SIDE PANEL) ---
    function updateQuestionMap() {
        DOM.mapContainer.innerHTML = '';
        
        exam.questions.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'q-grid-btn'; // Updated to use the correct CSS styling class name
            btn.textContent = index + 1;

            // Highlight state styles
            if (state.currentQuestionIndex === index) {
                btn.classList.add('active');
            }

            if (state.userAnswers[index] !== null) {
                btn.classList.add('answered');
            }

            if (state.flaggedQuestions.has(index)) {
                btn.classList.add('flagged');
            }

            // Click listener to jump direct to index
            btn.addEventListener('click', () => {
                state.currentQuestionIndex = index;
                renderQuestion();
            });

            DOM.mapContainer.appendChild(btn);
        });
    }

    function updateStats() {
        const answeredCount = state.userAnswers.filter(a => a !== null).length;
        DOM.statAnswered.textContent = answeredCount;
        DOM.statFlagged.textContent = state.flaggedQuestions.size;
    }

    // Wire up nav buttons
    DOM.prevBtn.addEventListener('click', () => {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    });

    DOM.nextBtn.addEventListener('click', () => {
        if (state.currentQuestionIndex < exam.questions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        }
    });

    DOM.flagBtn.addEventListener('click', toggleFlag);
    DOM.flagQuickBtn.addEventListener('click', toggleFlag);

    // --- 7. EXAM GRADING & SERIALIZATION ---
    
    // Open Confirmation modal with dynamic unanswered questions warning
    function openConfirmModal() {
        const answeredCount = state.userAnswers.filter(a => a !== null).length;
        const unansweredCount = exam.questions.length - answeredCount;

        DOM.confirmTotal.textContent = exam.questions.length;
        DOM.confirmAnswered.textContent = answeredCount;
        DOM.confirmUnanswered.textContent = unansweredCount;
        DOM.confirmFlagged.textContent = state.flaggedQuestions.size;

        const warningBox = document.getElementById('unanswered-warning-box');
        const warningText = document.getElementById('unanswered-warning-text');

        if (unansweredCount > 0) {
            DOM.confirmUnanswered.style.color = '#ef4444';
            
            // Compile list of unanswered question numbers (1-indexed)
            const unansweredList = [];
            state.userAnswers.forEach((ans, idx) => {
                if (ans === null) {
                    unansweredList.push(idx + 1);
                }
            });

            if (warningBox && warningText) {
                warningText.innerHTML = `Còn câu <strong>${unansweredList.join(', ')}</strong> bạn chưa làm. Bạn có muốn quay lại hoàn thành không hay nộp luôn?`;
                warningBox.style.display = 'block';
            }

            // High-fidelity dynamic button label adjustments
            if (DOM.modalCancel) DOM.modalCancel.textContent = 'Quay Lại Làm Nốt';
            if (DOM.modalSubmit) DOM.modalSubmit.textContent = 'Vẫn Nộp Bài Luôn';
        } else {
            DOM.confirmUnanswered.style.color = 'var(--text-muted)';
            if (warningBox) {
                warningBox.style.display = 'none';
            }
            if (DOM.modalCancel) DOM.modalCancel.textContent = 'Quay Lại Làm Tiếp';
            if (DOM.modalSubmit) DOM.modalSubmit.textContent = 'Xác Nhận Nộp Bài';
        }

        DOM.modalConfirm.classList.add('active');
    }

    function closeConfirmModal() {
        DOM.modalConfirm.classList.remove('active');
    }

    DOM.submitBtn.addEventListener('click', openConfirmModal);
    DOM.emergencySubmitBtn.addEventListener('click', openConfirmModal);
    DOM.modalCancel.addEventListener('click', closeConfirmModal);
    
    DOM.modalSubmit.addEventListener('click', () => {
        submitExam(false);
    });

    function submitExam(isForced = false) {
        if (state.isSubmitted) return;
        state.isSubmitted = true;

        clearInterval(state.timerInterval);
        closeConfirmModal();

        // 1. Grade the exam questions
        let correctCount = 0;
        exam.questions.forEach((q, idx) => {
            if (state.userAnswers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });

        // 2. Score assessments
        const totalQ = exam.questions.length;
        const scorePercentage = Math.round((correctCount / totalQ) * 100);
        const passed = scorePercentage >= exam.passScore;
        const timeSpent = exam.duration * 60 - state.timeLeft;

        // 3. Serialize active attempt object
        const attempt = {
            id: "attempt-" + Date.now(),
            username: currentUser.username,
            examId: exam.id,
            examTitle: exam.title,
            takenAt: new Date().toISOString(),
            timeSpent: timeSpent,
            correctCount: correctCount,
            totalQuestions: totalQ,
            scorePercentage: scorePercentage,
            passed: passed,
            userAnswers: state.userAnswers,
            flaggedQuestions: Array.from(state.flaggedQuestions)
        };

        // 4. Save into global attempts database
        let globalAttempts = [];
        const localAttempts = localStorage.getItem('quizflow_attempts');
        if (localAttempts) {
            globalAttempts = JSON.parse(localAttempts);
        }
        globalAttempts.push(attempt);
        localStorage.setItem('quizflow_attempts', JSON.stringify(globalAttempts));

        // 5. Save specific active attempt ID for review reference
        localStorage.setItem('quizflow_review_attempt_id', attempt.id);
        
        // 6. Clean active exam context
        localStorage.removeItem('quizflow_active_exam_id');

        // Bypass beforeunload warning securely
        window.isSubmittingBypass = true;

        // 7. Route redirect
        showToast("Nộp bài thi thành công! Đang lập bảng điểm...", "success");
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 1200);
    }

    // BeforeUnload lock bypass check
    window.addEventListener('beforeunload', (e) => {
        if (window.isSubmittingBypass) {
            // Allow clean escape on submission redirect
            return;
        }
        e.preventDefault();
        e.returnValue = 'Cảnh báo! Bạn đang làm bài thi. Rời trang web lúc này sẽ làm mất bài thi đang làm!';
    });

    // --- 8. THEME TOGGLES ---
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

    // --- 9. TOASTS NOTIFIER ---
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

    // ==========================================================================
    // --- 9.5 ANTI-CHEAT GUARDIAN SYSTEM ---
    // ==========================================================================
    let tabSwitchWarnings = 0;
    
    function initAntiCheatEngine() {
        const savedConfig = localStorage.getItem('quizflow_anticheat_config');
        const config = savedConfig ? JSON.parse(savedConfig) : { tabSwitch: true, disableCopy: true, fullscreen: true };
        
        // 1. Tab switching warning
        if (config.tabSwitch) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    tabSwitchWarnings++;
                    if (tabSwitchWarnings >= 3) {
                        showToast("Vi phạm gian lận quá 3 lần! Hệ thống tự động khóa và thu bài thi của bạn.", "error");
                        setTimeout(() => {
                            submitExam(true);
                        }, 1000);
                    } else {
                        alert(`[CẢNH BÁO GIAN LẬN] Bạn đã rời khỏi phòng thi ${tabSwitchWarnings}/3 lần. Nếu rời đi quá 3 lần, bài thi sẽ bị TỰ ĐỘNG THU NGAY LẬP TỨC!`);
                        showToast(`Cảnh báo chuyển tab: Lần ${tabSwitchWarnings}/3!`, "error");
                    }
                }
            });
        }

        // 2. Disable context menu, select, copy, paste
        if (config.disableCopy) {
            // Disable right click
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showToast("Tính năng Chuột Phải bị vô hiệu hóa để bảo mật đề thi!", "warning");
            });

            // Disable copy, cut, paste
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                showToast("Hành vi sao chép đề thi bị cấm!", "error");
            });
            document.addEventListener('cut', (e) => {
                e.preventDefault();
                showToast("Hành vi cắt đề thi bị cấm!", "error");
            });
            document.addEventListener('paste', (e) => {
                e.preventDefault();
                showToast("Hành vi dán vào phòng thi bị cấm!", "error");
            });

            // Disable selective hotkeys (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V)
            document.addEventListener('keydown', (e) => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                    (e.ctrlKey && e.key === 'u') ||
                    (e.ctrlKey && e.key === 'c') ||
                    (e.ctrlKey && e.key === 'v') ||
                    (e.ctrlKey && e.key === 's')
                ) {
                    e.preventDefault();
                    showToast("Tổ hợp phím bị vô hiệu hóa trong phòng thi!", "error");
                }
            });

            // Add CSS rule to prevent text selection dynamically
            const style = document.createElement('style');
            style.innerHTML = `
                body {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // 3. Force Fullscreen mode
        if (config.fullscreen) {
            // Helper to request fullscreen
            const enterFullscreen = () => {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            };

            // Overlay modal to trigger user interaction for fullscreen activation
            const fsOverlay = document.createElement('div');
            fsOverlay.id = 'fs-secure-overlay';
            fsOverlay.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(10px); z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; padding: 24px;";
            fsOverlay.innerHTML = `
                <i class="fa-solid fa-shield-halved" style="font-size: 64px; color: #ef4444; margin-bottom: 24px; animation: pulseFade 2s infinite;"></i>
                <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; letter-spacing: 1px;">BẮT BUỘC TOÀN MÀN HÌNH (FULLSCREEN)</h2>
                <p style="font-size: 14px; max-width: 480px; margin-bottom: 32px; color: #94a3b8; line-height: 1.6;">
                    Đề thi này đã được cấu hình chế độ bảo mật toàn màn hình để ngăn ngừa gian lận. Vui lòng click nút bên dưới để kích hoạt toàn màn hình và bắt đầu làm bài.
                </p>
                <button id="btn-activate-fullscreen" class="btn btn-primary" style="padding: 14px 28px; font-size: 16px; font-weight: 700; border-radius: var(--radius-md);"><i class="fa-solid fa-expand"></i> Kích Hoạt & Vào Phòng Thi</button>
            `;
            document.body.appendChild(fsOverlay);

            document.getElementById('btn-activate-fullscreen').addEventListener('click', () => {
                enterFullscreen();
                setTimeout(() => {
                    fsOverlay.remove();
                }, 300);
            });

            // Listen to fullscreen changes to check if student tries to escape
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement && !state.isSubmitted) {
                    tabSwitchWarnings++;
                    if (tabSwitchWarnings >= 3) {
                        showToast("Thoát toàn màn hình quá 3 lần! Bài thi tự động thu.", "error");
                        submitExam(true);
                    } else {
                        alert(`[CẢNH BÁO GIAN LẬN] Bạn đã thoát chế độ Toàn màn hình! Vui lòng giữ toàn màn hình khi làm bài. Vi phạm lần ${tabSwitchWarnings}/3.`);
                        // Re-offer overlay
                        if (!document.getElementById('fs-secure-overlay')) {
                            document.body.appendChild(fsOverlay);
                        }
                    }
                }
            });
        }
    }

    // --- 10. RUNNING ---
    startTimer();
    initAntiCheatEngine();
    renderQuestion();
});
