/* ==========================================================================
   QUIZFLOW EXAM RESULT & EXPLANATION CONTROLLER
   Score Calculations, Radial gauges, and Question-by-Question Review cards.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SESSION & ROUTE GUARD VALIDATION
    const currentUser = Students.getCurrentUser();
    if (!currentUser) return; // Guard handles redirect

    const attemptId = localStorage.getItem('quizflow_review_attempt_id');
    if (!attemptId) {
        alert("Không tìm thấy kết quả bài làm cần xem lại!");
        window.location.href = '../index.html';
        return;
    }

    // Retrieve attempts database
    let globalAttempts = [];
    const localAttempts = localStorage.getItem('quizflow_attempts');
    if (localAttempts) {
        globalAttempts = JSON.parse(localAttempts);
    }

    const attempt = globalAttempts.find(att => att.id === attemptId);
    if (!attempt) {
        alert("Kết quả bài làm này không tồn tại trên hệ thống!");
        window.location.href = '../index.html';
        return;
    }

    // Retrieve exams database to compare with original questions
    let exams = [];
    const localExams = localStorage.getItem('quizflow_exams');
    if (localExams) {
        exams = JSON.parse(localExams);
    }

    const exam = exams.find(e => e.id === attempt.examId);
    if (!exam) {
        alert("Đề thi tương ứng đã bị xoá khỏi hệ thống, không thể xem lại chi tiết!");
        window.location.href = '../index.html';
        return;
    }

    // --- 2. DOM INTERFACE SELECTORS ---
    const DOM = {
        examTitleLabel: document.getElementById('result-title-label'),
        scorePercentage: document.getElementById('result-score-percentage'),
        scoreFraction: document.getElementById('result-score-fraction'),
        radialProgress: document.getElementById('score-radial-widget'),
        evaluationBanner: document.getElementById('result-evaluation-banner'),
        
        // Metrics
        metricCorrect: document.getElementById('result-metric-correct'),
        metricIncorrect: document.getElementById('result-metric-incorrect'),
        metricUnanswered: document.getElementById('result-metric-unanswered'),
        metricTime: document.getElementById('result-metric-time'),
        
        // Detailed review section
        toggleReviewBtn: document.getElementById('btn-toggle-detailed-review'),
        reviewContainer: document.getElementById('detailed-review-container'),
        reviewListRoot: document.getElementById('review-questions-list-root'),
        
        themeToggle: document.getElementById('theme-toggle')
    };

    // Set exam title
    DOM.examTitleLabel.textContent = exam.title;

    // --- 3. SCORE DISPLAY RENDERING ---

    // Radial Progress Indicator using conic-gradient
    function renderRadialScore() {
        const pct = attempt.scorePercentage;
        DOM.scorePercentage.innerHTML = `${pct}<span class="pct">%</span>`;
        DOM.scoreFraction.textContent = `${attempt.correctCount}/${attempt.totalQuestions} câu đúng`;

        // Update conic-gradient angle in styles
        if (DOM.radialProgress) {
            // Check light/dark modes to apply correct color schemes
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99, 102, 241, 0.08)';
            const colorPrimary = '#6366f1';
            const colorSuccess = '#10b981';
            const colorDanger = '#ef4444';
            
            let color = colorPrimary;
            if (pct >= exam.passScore) color = colorSuccess;
            else if (pct < 30) color = colorDanger;

            DOM.radialProgress.style.background = `conic-gradient(${color} ${pct * 3.6}deg, ${trackColor} 0deg)`;
        }
    }

    // Pass / Fail Evaluation Banner styling
    function renderEvaluationBanner() {
        const span = DOM.evaluationBanner.querySelector('span');
        if (attempt.passed) {
            DOM.evaluationBanner.className = "result-status-banner banner-success";
            span.innerHTML = `<i class="fas fa-check-circle"></i> ĐẠT YÊU CẦU (Điểm chuẩn qua môn: ${exam.passScore}%)`;
        } else {
            DOM.evaluationBanner.className = "result-status-banner banner-danger";
            span.innerHTML = `<i class="fas fa-times-circle"></i> CHƯA ĐẠT (Điểm chuẩn qua môn: ${exam.passScore}%)`;
        }
    }

    // Calculate metrics
    function renderMetrics() {
        let correct = attempt.correctCount;
        
        // Count unanswered questions
        let unanswered = 0;
        attempt.userAnswers.forEach(ans => {
            if (ans === null) unanswered++;
        });

        let incorrect = attempt.totalQuestions - correct - unanswered;

        // Formatted Time Spent
        const mins = Math.floor(attempt.timeSpent / 60);
        const secs = attempt.timeSpent % 60;
        const timeStr = mins > 0 ? `${mins}phút ${secs}giây` : `${secs}giây`;

        DOM.metricCorrect.textContent = correct;
        DOM.metricIncorrect.textContent = incorrect;
        DOM.metricUnanswered.textContent = unanswered;
        DOM.metricTime.textContent = timeStr;
    }

    // --- 4. DETAILED REVIEW CARD RENDER ---
    function renderDetailedReview() {
        DOM.reviewListRoot.innerHTML = '';

        exam.questions.forEach((q, qIdx) => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // Check correctness status
            const userAns = attempt.userAnswers[qIdx];
            const correctAns = q.correctAnswer;
            
            let statusBadge = '';
            if (userAns === null) {
                card.classList.add('review-unanswered');
                statusBadge = `<span class="review-status status-unanswered"><i class="fas fa-eye-slash"></i> Bỏ qua</span>`;
            } else if (userAns === correctAns) {
                card.classList.add('review-correct');
                statusBadge = `<span class="review-status status-correct"><i class="fas fa-check"></i> Đúng</span>`;
            } else {
                card.classList.add('review-incorrect');
                statusBadge = `<span class="review-status status-incorrect"><i class="fas fa-times"></i> Sai</span>`;
            }

            // Options List construction
            let optionsHTML = '';
            q.options.forEach((optText, optIdx) => {
                let optClass = 'review-option';
                let optIcon = '';

                // Style based on correctness
                if (optIdx === correctAns) {
                    optClass += ' correct';
                    optIcon = '<div class="opt-badge"><i class="fas fa-check"></i> Đáp án đúng</div>';
                } else if (optIdx === userAns) {
                    optClass += ' incorrect';
                    optIcon = '<div class="opt-badge"><i class="fas fa-times"></i> Lựa chọn của bạn</div>';
                }

                const prefix = String.fromCharCode(65 + optIdx); // A, B, C, D
                optionsHTML += `
                    <div class="${optClass}">
                        <div class="opt-left">
                            <span class="opt-letter">${prefix}</span>
                            <span class="opt-text">${optText}</span>
                        </div>
                        ${optIcon}
                    </div>
                `;
            });

            // Explanation panel construction
            let explanationHTML = '';
            if (q.explanation) {
                explanationHTML = `
                    <div class="explanation-box">
                        <div class="exp-header">
                            <i class="fa-solid fa-lightbulb"></i>
                            <strong>Giải Thích Đáp Án:</strong>
                        </div>
                        <p class="exp-body">${q.explanation}</p>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="review-card-header">
                    <span class="review-index">Câu hỏi ${qIdx + 1}:</span>
                    ${statusBadge}
                </div>
                <p class="review-question-text">${q.question}</p>
                <div class="review-options-list">
                    ${optionsHTML}
                </div>
                ${explanationHTML}
            `;

            DOM.reviewListRoot.appendChild(card);
        });
    }

    // Toggle detailed review panel visibility
    if (DOM.toggleReviewBtn) {
        DOM.toggleReviewBtn.addEventListener('click', () => {
            DOM.reviewContainer.classList.remove('hidden');
            
            // Auto scroll down to review section
            setTimeout(() => {
                DOM.reviewContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            
            DOM.toggleReviewBtn.style.display = 'none'; // hide trigger after expansion
        });
    }

    // --- 5. THEME TOGGLE SYSTEM ---
    const savedTheme = localStorage.getItem('quizflow_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    renderRadialScore(); // Refresh radial theme background

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('quizflow_theme', newTheme);
            updateThemeIcon(newTheme);
            renderRadialScore(); // Re-compute radial track color
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

    // --- 6. TOAST MESSAGES UTILITY ---
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

    // --- 7. LOAD PAGE ---
    renderRadialScore();
    renderEvaluationBanner();
    renderMetrics();
    renderDetailedReview();
});
