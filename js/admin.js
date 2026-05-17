/* ==========================================================================
   QUIZFLOW ADMINISTRATIVE CONTROL PANEL ENGINE
   Complete CRUD Operations for Exams and Questions, System Analytics, & Logs.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ROLE & ROUTE GUARD VALIDATION
    const currentUser = Students.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) return; // Handled by auth guard

    let state = {
        exams: [],
        attempts: [],
        selectedExamId: null
    };

    // Load exams library with smart auto-update/self-healing sync
    const localExams = localStorage.getItem('quizflow_exams');
    if (!localExams) {
        state.exams = DEFAULT_EXAMS;
        localStorage.setItem('quizflow_exams', JSON.stringify(DEFAULT_EXAMS));
    } else {
        const parsed = JSON.parse(localExams);
        // Self-Healing: Check if any default exam has outdated question count or missing isReview flag
        const hasOutdatedDefaultExams = parsed.some(ex => {
            const defaultEx = DEFAULT_EXAMS.find(d => d.id === ex.id);
            return defaultEx && (defaultEx.questions.length !== ex.questions.length || defaultEx.isReview !== ex.isReview);
        });

        if (parsed.length < DEFAULT_EXAMS.length || hasOutdatedDefaultExams) {
            const customExams = parsed.filter(ex => !ex.id.startsWith('exam-'));
            state.exams = [...DEFAULT_EXAMS, ...customExams];
            localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
        } else {
            state.exams = parsed;
        }
    }

    // Load attempts history
    const localAttempts = localStorage.getItem('quizflow_attempts');
    state.attempts = localAttempts ? JSON.parse(localAttempts) : [];

    // --- 2. DOM INTERFACE SELECTORS ---
    const DOM = {
        // Analytics
        totalExams: document.getElementById('admin-total-exams'),
        totalQuestions: document.getElementById('admin-total-questions'),
        totalAttempts: document.getElementById('admin-total-attempts'),
        avgScore: document.getElementById('admin-avg-score'),
        
        // Lists
        examsCountBadge: document.getElementById('admin-exams-count'),
        examsContainer: document.getElementById('admin-exams-list-container'),
        selectedExamTitleIndicator: document.getElementById('admin-selected-exam-title'),
        questionsContainer: document.getElementById('admin-questions-list-container'),
        attemptsTableBody: document.getElementById('admin-global-attempts-table-body'),
        noAttemptsPlaceholder: document.getElementById('admin-no-attempts-placeholder'),
        
        // Top action buttons
        addExamBtn: document.getElementById('btn-admin-add-exam'),
        resetSystemBtn: document.getElementById('btn-admin-reset-system'),
        addQuestionBtn: document.getElementById('btn-admin-add-question'),
        exportHistoryBtn: document.getElementById('btn-export-history-json'),
        clearHistoryBtn: document.getElementById('btn-clear-global-attempts'),
        
        // Exam Form Modal
        modalExam: document.getElementById('modal-exam-form'),
        modalExamTitleText: document.getElementById('exam-modal-title-text'),
        formExamId: document.getElementById('form-exam-id'),
        formExamTitle: document.getElementById('form-exam-title'),
        formExamSubject: document.getElementById('form-exam-subject'),
        formExamDuration: document.getElementById('form-exam-duration'),
        formExamPassScore: document.getElementById('form-exam-passscore'),
        formExamDifficulty: document.getElementById('form-exam-difficulty'),
        formExamDescription: document.getElementById('form-exam-description'),
        formExamCode: document.getElementById('form-exam-code'),
        btnGenerateExamCode: document.getElementById('btn-generate-exam-code'),
        btnSaveExam: document.getElementById('btn-save-exam-modal'),
        btnCancelExam: document.getElementById('btn-cancel-exam-modal'),
        btnCloseExam: document.getElementById('btn-close-exam-modal'),
        
        // Question Form Modal
        modalQuestion: document.getElementById('modal-question-form'),
        modalQuestionTitleText: document.getElementById('question-modal-title-text'),
        formQuestionId: document.getElementById('form-question-id'),
        formQuestionText: document.getElementById('form-question-text'),
        formQuestionExplanation: document.getElementById('form-question-explanation'),
        btnSaveQuestion: document.getElementById('btn-save-question-modal'),
        btnCancelQuestion: document.getElementById('btn-cancel-question-modal'),
        btnCloseQuestion: document.getElementById('btn-close-question-modal'),
        
        themeToggle: document.getElementById('theme-toggle')
    };

    // --- 3. SYSTEM ANALYTICS ---
    function recalculateAnalytics() {
        DOM.totalExams.textContent = state.exams.length;
        
        const totalQ = state.exams.reduce((acc, curr) => acc + curr.questions.length, 0);
        DOM.totalQuestions.textContent = totalQ;

        const totalAttemptsCount = state.attempts.length;
        DOM.totalAttempts.textContent = totalAttemptsCount;

        if (totalAttemptsCount === 0) {
            DOM.avgScore.textContent = '0.0%';
            return;
        }

        const sumScores = state.attempts.reduce((acc, curr) => acc + curr.scorePercentage, 0);
        const avg = (sumScores / totalAttemptsCount).toFixed(1);
        DOM.avgScore.textContent = `${avg}%`;
    }

    // --- 4. EXAMS CRUD VIEW ---
    function renderExamsList() {
        DOM.examsContainer.innerHTML = '';
        DOM.examsCountBadge.textContent = `${state.exams.length} Đề`;

        if (state.exams.length === 0) {
            DOM.examsContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                    <i class="fas fa-folder-open" style="font-size: 28px; margin-bottom: 8px; opacity: 0.5;"></i>
                    <p>Thư viện đề trống. Hãy tạo đề mới!</p>
                </div>
            `;
            return;
        }

        state.exams.forEach(exam => {
            const row = document.createElement('div');
            row.className = 'admin-exam-row';
            if (state.selectedExamId === exam.id) {
                row.classList.add('selected');
            }

            const codeBadge = exam.examCode ? `<span class="badge badge-info" style="font-weight: 800; font-size: 10px; padding: 2px 6px; display: inline-flex; align-items: center; gap: 4px; border-radius: var(--radius-sm); margin-left: 6px; background-color: var(--info-light); color: var(--info);"><i class="fa-solid fa-key" style="font-size: 8px;"></i> ${exam.examCode}</span>` : '';
            row.innerHTML = `
                <div class="exam-row-details">
                    <div style="display: flex; align-items: center;">
                        <span class="exam-row-subject">${exam.subject}</span>
                        ${codeBadge}
                    </div>
                    <h4 class="exam-row-title" style="margin-top: 4px;">${exam.title}</h4>
                    <span class="exam-row-meta">${exam.questions.length} câu • ${exam.duration} phút • Đạt ${exam.passScore}%</span>
                </div>
                <div class="exam-row-actions">
                    <button class="btn btn-sm btn-outline-primary btn-edit-exam" data-id="${exam.id}" title="Chỉnh sửa thông tin đề">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-exam" data-id="${exam.id}" title="Xoá đề thi này">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Row click triggers loading questions list
            row.addEventListener('click', (e) => {
                if (e.target.closest('.exam-row-actions')) return; // Avoid loading on button clicks
                selectExam(exam.id);
            });

            DOM.examsContainer.appendChild(row);
        });

        // Wire up exam edit buttons
        document.querySelectorAll('.btn-edit-exam').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openExamModal(btn.getAttribute('data-id'));
            });
        });

        // Wire up exam delete buttons
        document.querySelectorAll('.btn-delete-exam').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteExam(btn.getAttribute('data-id'));
            });
        });
    }

    function selectExam(examId) {
        state.selectedExamId = examId;
        
        // Highlights the active row in left container
        const rows = DOM.examsContainer.querySelectorAll('.admin-exam-row');
        rows.forEach((r, idx) => {
            if (state.exams[idx].id === examId) r.classList.add('selected');
            else r.classList.remove('selected');
        });

        const selected = state.exams.find(e => e.id === examId);
        if (selected) {
            DOM.selectedExamTitleIndicator.innerHTML = `Đề đang chọn: <strong>${selected.title}</strong>`;
            DOM.addQuestionBtn.disabled = false;
            renderQuestionsList(selected);
        }
    }

    // Modal Control: Exam CRUD
    function openExamModal(examId = null) {
        if (examId) {
            // Edit Mode
            const target = state.exams.find(e => e.id === examId);
            if (!target) return;
            DOM.modalExamTitleText.textContent = "Chỉnh Sửa Đề Thi";
            DOM.formExamId.value = target.id;
            DOM.formExamTitle.value = target.title;
            DOM.formExamSubject.value = target.subject;
            DOM.formExamDuration.value = target.duration;
            DOM.formExamPassScore.value = target.passScore;
            DOM.formExamDifficulty.value = target.difficulty;
            DOM.formExamDescription.value = target.description || '';
            DOM.formExamCode.value = target.examCode || '';
        } else {
            // Create Mode
            DOM.modalExamTitleText.textContent = "Tạo Đề Thi Trắc Nghiệm Mới";
            document.getElementById('admin-exam-form').reset();
            DOM.formExamId.value = '';
            
            // Auto generate a 5-character random exam code for convenience
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let randCode = '';
            for (let i = 0; i < 5; i++) randCode += chars.charAt(Math.floor(Math.random() * chars.length));
            DOM.formExamCode.value = randCode;
        }
        DOM.modalExam.classList.add('active');
    }

    function closeExamModal() {
        DOM.modalExam.classList.remove('active');
    }

    DOM.addExamBtn.addEventListener('click', () => openExamModal());
    DOM.btnCancelExam.addEventListener('click', closeExamModal);
    DOM.btnCloseExam.addEventListener('click', closeExamModal);

    // Save Exam Submit
    DOM.btnSaveExam.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementById('admin-exam-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const id = DOM.formExamId.value.trim();
        const title = DOM.formExamTitle.value.trim();
        const subject = DOM.formExamSubject.value;
        const duration = parseInt(DOM.formExamDuration.value);
        const passScore = parseInt(DOM.formExamPassScore.value);
        const difficulty = DOM.formExamDifficulty.value;
        const description = DOM.formExamDescription.value.trim();
        const examCode = DOM.formExamCode.value.trim().toUpperCase();

        let codeFinal = examCode;
        if (!codeFinal) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < 5; i++) codeFinal += chars.charAt(Math.floor(Math.random() * chars.length));
        } else if (codeFinal.length !== 5) {
            showToast("Mã đề thi bắt buộc phải bao gồm đúng 5 ký tự!", "warning");
            return;
        }

        if (id) {
            // Update exist
            const idx = state.exams.findIndex(e => e.id === id);
            if (idx !== -1) {
                state.exams[idx].title = title;
                state.exams[idx].subject = subject;
                state.exams[idx].duration = duration;
                state.exams[idx].passScore = passScore;
                state.exams[idx].difficulty = difficulty;
                state.exams[idx].description = description;
                state.exams[idx].examCode = codeFinal;
                showToast("Cập nhật thông tin đề thành công!", "success");
            }
        } else {
            // Create brand new
            const newExam = {
                id: "exam-" + Date.now(),
                title: title,
                subject: subject,
                duration: duration,
                passScore: passScore,
                difficulty: difficulty,
                description: description,
                examCode: codeFinal,
                questions: []
            };
            state.exams.push(newExam);
            showToast("Đã tạo đề thi trắc nghiệm mới thành công!", "success");
        }

        localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
        closeExamModal();
        recalculateAnalytics();
        renderExamsList();
        
        // Re-select if updated active exam
        if (id && state.selectedExamId === id) {
            selectExam(id);
        }
    });

    function deleteExam(examId) {
        const target = state.exams.find(e => e.id === examId);
        if (!target) return;

        if (confirm(`Cảnh báo cực nguy hiểm! Bạn thực sự muốn xóa đề thi "${target.title}" cùng toàn bộ ${target.questions.length} câu hỏi liên quan?`)) {
            state.exams = state.exams.filter(e => e.id !== examId);
            localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
            
            showToast("Đã xoá đề thi thành công!", "success");

            // Reset active panels if active selected was deleted
            if (state.selectedExamId === examId) {
                state.selectedExamId = null;
                DOM.selectedExamTitleIndicator.textContent = 'Đề đang chọn: (Chưa chọn)';
                DOM.addQuestionBtn.disabled = true;
                DOM.questionsContainer.innerHTML = `
                    <div class="placeholder-select-exam">
                        <i class="fa-solid fa-arrow-left pulse-arrow-icon"></i>
                        <p>Vui lòng click chọn một **Đề thi** từ danh sách bên trái để chỉnh sửa và quản lý danh sách câu hỏi chi tiết.</p>
                    </div>
                `;
            }

            recalculateAnalytics();
            renderExamsList();
        }
    }

    // --- 5. QUESTIONS CRUD VIEW ---
    function renderQuestionsList(examObj) {
        DOM.questionsContainer.innerHTML = '';
        
        if (examObj.questions.length === 0) {
            DOM.questionsContainer.innerHTML = `
                <div class="placeholder-empty-questions" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-clipboard-question" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>Đề thi này hiện chưa chứa câu hỏi trắc nghiệm nào.</p>
                    <p style="font-size: 13px; margin-top: 5px;">Hãy click nút <b>"Thêm Câu Hỏi"</b> phía trên góc phải để bổ sung câu hỏi đầu tiên!</p>
                </div>
            `;
            return;
        }

        examObj.questions.forEach((q, qIdx) => {
            const card = document.createElement('div');
            card.className = 'admin-question-item';

            // Options items text list with correct highlights
            let optionsListHTML = '';
            q.options.forEach((optText, optIdx) => {
                const prefix = String.fromCharCode(65 + optIdx);
                const isCorrect = optIdx === q.correctAnswer;
                const correctBadge = isCorrect ? '<span class="correct-badge-mini"><i class="fas fa-check"></i> Đúng</span>' : '';
                
                optionsListHTML += `
                    <div class="q-opt-preview ${isCorrect ? 'correct' : ''}">
                        <strong>${prefix}.</strong> &nbsp; ${optText} ${correctBadge}
                    </div>
                `;
            });

            // Explanation section
            let expHTML = '';
            if (q.explanation) {
                expHTML = `
                    <div class="q-exp-preview">
                        <i class="fas fa-lightbulb"></i> &nbsp; <b>Giải thích:</b> ${q.explanation}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="item-header">
                    <span class="item-index">Câu số ${qIdx + 1}:</span>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary btn-edit-q" data-id="${q.id}" title="Sửa câu hỏi">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-delete-q" data-id="${q.id}" title="Xoá câu hỏi">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="item-text">${q.question}</p>
                <div class="item-options-preview">
                    ${optionsListHTML}
                </div>
                ${expHTML}
            `;

            DOM.questionsContainer.appendChild(card);
        });

        // Wire up edit question buttons
        document.querySelectorAll('.btn-edit-q').forEach(btn => {
            btn.addEventListener('click', () => {
                openQuestionModal(btn.getAttribute('data-id'));
            });
        });

        // Wire up delete question buttons
        document.querySelectorAll('.btn-delete-q').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteQuestion(btn.getAttribute('data-id'));
            });
        });
    }

    // Modal Control: Question CRUD
    function openQuestionModal(qId = null) {
        if (!state.selectedExamId) return;
        const activeExam = state.exams.find(e => e.id === state.selectedExamId);
        if (!activeExam) return;

        if (qId) {
            // Edit Mode
            const targetQ = activeExam.questions.find(q => q.id === qId);
            if (!targetQ) return;
            DOM.modalQuestionTitleText.textContent = "Chỉnh Sửa Câu Hỏi";
            DOM.formQuestionId.value = targetQ.id;
            DOM.formQuestionText.value = targetQ.question;
            DOM.formQuestionExplanation.value = targetQ.explanation || '';
            
            // Populate options inputs
            targetQ.options.forEach((optText, idx) => {
                document.getElementById(`form-option-${idx}`).value = optText;
            });

            // Set radio checked
            const radio = document.querySelector(`input[name="form-correct-answer"][value="${targetQ.correctAnswer}"]`);
            if (radio) radio.checked = true;

        } else {
            // Create Mode
            DOM.modalQuestionTitleText.textContent = "Thêm Câu Hỏi Trắc Nghiệm Mới";
            document.getElementById('admin-question-form').reset();
            DOM.formQuestionId.value = '';
            // Make sure radio A is selected by default
            document.getElementById('correct-a').checked = true;
        }
        DOM.modalQuestion.classList.add('active');
    }

    function closeQuestionModal() {
        DOM.modalQuestion.classList.remove('active');
    }

    DOM.addQuestionBtn.addEventListener('click', () => openQuestionModal());
    DOM.btnCancelQuestion.addEventListener('click', closeQuestionModal);
    DOM.btnCloseQuestion.addEventListener('click', closeQuestionModal);

    // Save Question Submit
    DOM.btnSaveQuestion.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementById('admin-question-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const activeExam = state.exams.find(e => e.id === state.selectedExamId);
        if (!activeExam) return;

        const qId = DOM.formQuestionId.value.trim();
        const qText = DOM.formQuestionText.value.trim();
        const qExp = DOM.formQuestionExplanation.value.trim();
        
        // Grab correct radio answer
        const correctAnswerVal = parseInt(document.querySelector('input[name="form-correct-answer"]:checked').value);

        // Options array
        const options = [
            document.getElementById('form-option-0').value.trim(),
            document.getElementById('form-option-1').value.trim(),
            document.getElementById('form-option-2').value.trim(),
            document.getElementById('form-option-3').value.trim()
        ];

        if (qId) {
            // Edit Mode Update
            const idx = activeExam.questions.findIndex(q => q.id === qId);
            if (idx !== -1) {
                activeExam.questions[idx].question = qText;
                activeExam.questions[idx].options = options;
                activeExam.questions[idx].correctAnswer = correctAnswerVal;
                activeExam.questions[idx].explanation = qExp;
                showToast("Đã sửa câu hỏi thành công!", "success");
            }
        } else {
            // Create Mode Add
            const newQ = {
                id: "q-dyn-" + Date.now(),
                question: qText,
                options: options,
                correctAnswer: correctAnswerVal,
                explanation: qExp
            };
            activeExam.questions.push(newQ);
            showToast("Đã thêm câu hỏi mới thành công!", "success");
        }

        localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
        closeQuestionModal();
        recalculateAnalytics();
        renderExamsList();
        renderQuestionsList(activeExam);
    });

    function deleteQuestion(qId) {
        const activeExam = state.exams.find(e => e.id === state.selectedExamId);
        if (!activeExam) return;

        if (confirm("Bạn có chắc chắn muốn xoá câu hỏi trắc nghiệm này khỏi đề thi?")) {
            activeExam.questions = activeExam.questions.filter(q => q.id !== qId);
            localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
            
            showToast("Đã xoá câu hỏi thành công!", "success");
            
            recalculateAnalytics();
            renderExamsList();
            renderQuestionsList(activeExam);
        }
    }

    // --- 6. CANDIDATES HISTORY LOG TABLES ---
    function renderGlobalAttempts() {
        // Dynamic reload from localStorage to stay 100% synchronized
        const localAttempts = localStorage.getItem('quizflow_attempts');
        state.attempts = localAttempts ? JSON.parse(localAttempts) : [];

        DOM.attemptsTableBody.innerHTML = '';
        
        if (state.attempts.length === 0) {
            DOM.noAttemptsPlaceholder.style.display = 'flex';
            document.querySelector('.card-global-attempts-history .history-table').style.display = 'none';
            return;
        }

        DOM.noAttemptsPlaceholder.style.display = 'none';
        document.querySelector('.card-global-attempts-history .history-table').style.display = 'table';

        // Use non-mutating copy to reverse and iterate safely
        [...state.attempts].reverse().forEach((attempt, index) => {
            const tr = document.createElement('tr');
            
            const dateStr = new Date(attempt.takenAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });

            const durationStr = `${Math.floor(attempt.timeSpent / 60)} phút ${attempt.timeSpent % 60} giây`;
            const evaluationBadge = attempt.passed ? 
                `<span class="badge badge-success" style="padding: 4px 8px; border-radius: 4px;"><i class="fas fa-check-circle"></i> Đạt</span>` : 
                `<span class="badge badge-danger" style="padding: 4px 8px; border-radius: 4px;"><i class="fas fa-times-circle"></i> Chưa Đạt</span>`;

            // Dynamic User styling & classification badges
            const displayName = attempt.name || attempt.username;
            const usernameDisplay = `@${attempt.username}`;
            let classBadgeStyle = 'background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3);';
            let classIcon = 'fa-graduation-cap';
            if (attempt.studentType && attempt.studentType.toLowerCase() === 'sinh viên') {
                classBadgeStyle = 'background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3);';
                classIcon = 'fa-university';
            }
            const classificationBadge = `
                <span class="badge" style="${classBadgeStyle} text-transform: capitalize; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
                    <i class="fa-solid ${classIcon}"></i> ${attempt.studentType || 'học sinh'}
                </span>
            `;

            // Violation / tab switches count badges
            const cheats = attempt.cheatingCount || 0;
            let cheatsDisplay = '';
            if (cheats > 0) {
                cheatsDisplay = `<span class="badge badge-danger" style="background-color: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 700; padding: 4px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> ${cheats} lần</span>`;
            } else {
                cheatsDisplay = `<span class="badge badge-success" style="background-color: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 600; padding: 4px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-check"></i> An toàn</span>`;
            }

            tr.innerHTML = `
                <td><strong>${index + 1}</strong></td>
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${displayName} <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">(${usernameDisplay})</span></div>
                    ${classificationBadge}
                </td>
                <td class="history-exam-title" style="font-weight: 600;">${attempt.examTitle}</td>
                <td style="color: var(--text-secondary); font-size: 12px;">${dateStr}</td>
                <td>${durationStr}</td>
                <td>${cheatsDisplay}</td>
                <td>
                    <span class="color-primary" style="font-weight:600;">${attempt.correctCount}/${attempt.totalQuestions}</span>
                </td>
                <td><strong style="color: var(--primary); font-size: 14px;">${attempt.scorePercentage}%</strong></td>
                <td>${evaluationBadge}</td>
            `;

            DOM.attemptsTableBody.appendChild(tr);
        });
    }

    // JSON export helper
    DOM.exportHistoryBtn.addEventListener('click', () => {
        if (state.attempts.length === 0) {
            showToast("Không có lịch sử thi nào để xuất dữ liệu!", "warning");
            return;
        }

        try {
            const dataStr = JSON.stringify(state.attempts, null, 4);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `quizflow_candidates_history_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            showToast("Đã xuất tệp dữ liệu lịch sử JSON thành công!", "success");
        } catch (err) {
            showToast("Lỗi trong quá trình xuất file dữ liệu!", "error");
        }
    });

    // Clear all attempts history log
    DOM.clearHistoryBtn.addEventListener('click', () => {
        if (confirm("⚠️ CẢNH BÁO NGUY HIỂM! Bạn chắc chắn muốn xóa toàn bộ lịch sử thi của TẤT CẢ các học sinh trong toàn bộ hệ thống? Hành động này sẽ làm trống hoàn toàn nhật ký làm bài.")) {
            state.attempts = [];
            localStorage.setItem('quizflow_attempts', JSON.stringify([]));
            showToast("Đã xoá sạch lịch sử thi trên toàn hệ thống!", "success");
            
            recalculateAnalytics();
            renderGlobalAttempts();
        }
    });

    // --- 7. SYSTEM RESET ---
    DOM.resetSystemBtn.addEventListener('click', () => {
        if (confirm("Bạn có muốn xóa toàn bộ dữ liệu tự tạo và khôi phục lại thư viện đề thi gốc 13 đề chuẩn mặc định của hệ thống?")) {
            localStorage.removeItem('quizflow_exams');
            localStorage.removeItem('quizflow_attempts');
            
            state.exams = DEFAULT_EXAMS;
            state.attempts = [];
            
            localStorage.setItem('quizflow_exams', JSON.stringify(DEFAULT_EXAMS));
            localStorage.setItem('quizflow_attempts', JSON.stringify([]));
            
            state.selectedExamId = null;
            DOM.selectedExamTitleIndicator.textContent = 'Đề đang chọn: (Chưa chọn)';
            DOM.addQuestionBtn.disabled = true;
            DOM.questionsContainer.innerHTML = `
                <div class="placeholder-select-exam">
                    <i class="fa-solid fa-arrow-left pulse-arrow-icon"></i>
                    <p>Vui lòng click chọn một **Đề thi** từ danh sách bên trái để chỉnh sửa và quản lý danh sách câu hỏi chi tiết.</p>
                </div>
            `;

            showToast("Đã đặt lại dữ liệu gốc của hệ thống thành công!", "success");
            
            recalculateAnalytics();
            renderExamsList();
            renderGlobalAttempts();
        }
    });

    // --- 8. THEME TOGGLE CONTROL ---
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

    // --- 9. TOAST MESSAGES CENTER ---
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

    // --- 9.5 EXAM RANDOM CODE GENERATION ---
    if (DOM.btnGenerateExamCode && DOM.formExamCode) {
        DOM.btnGenerateExamCode.addEventListener('click', () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 5; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            DOM.formExamCode.value = result;
            showToast("Đã tạo mã đề thi ngẫu nhiên: " + result, "info");
        });
    }

    // ==========================================================================
    // --- 9.6 ADMINISTRATIVE TAB SWITCHING SYSTEM ---
    // ==========================================================================
    const tabs = {
        btnExams: document.getElementById('tab-admin-exams'),
        btnUsers: document.getElementById('tab-admin-users'),
        btnSettings: document.getElementById('tab-admin-settings'),
        panelExams: document.getElementById('panel-exams-container'),
        panelUsers: document.getElementById('panel-users-container'),
        panelSettings: document.getElementById('panel-settings-container')
    };

    function switchAdminTab(targetTab) {
        // Remove active class from buttons
        [tabs.btnExams, tabs.btnUsers, tabs.btnSettings].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        // Hide panels
        [tabs.panelExams, tabs.panelUsers, tabs.panelSettings].forEach(p => {
            if (p) p.style.display = 'none';
        });

        if (targetTab === 'exams') {
            if (tabs.btnExams) tabs.btnExams.classList.add('active');
            if (tabs.panelExams) tabs.panelExams.style.display = 'block';
        } else if (targetTab === 'users') {
            if (tabs.btnUsers) tabs.btnUsers.classList.add('active');
            if (tabs.panelUsers) tabs.panelUsers.style.display = 'block';
            renderUsersList();
        } else if (targetTab === 'settings') {
            if (tabs.btnSettings) tabs.btnSettings.classList.add('active');
            if (tabs.panelSettings) tabs.panelSettings.style.display = 'block';
            populateSettingsExams();
            loadAntiCheatConfig();
        }
    }

    if (tabs.btnExams) tabs.btnExams.addEventListener('click', () => switchAdminTab('exams'));
    if (tabs.btnUsers) tabs.btnUsers.addEventListener('click', () => switchAdminTab('users'));
    if (tabs.btnSettings) tabs.btnSettings.addEventListener('click', () => switchAdminTab('settings'));

    // ==========================================================================
    // --- 9.7 USER MANAGEMENT CONTROLLER ---
    // ==========================================================================
    const userDOM = {
        tableBody: document.getElementById('admin-users-table-body'),
        btnAddUser: document.getElementById('btn-admin-add-user'),
        modalUser: document.getElementById('modal-user-form'),
        btnCloseModal: document.getElementById('btn-close-user-modal'),
        btnCancelModal: document.getElementById('btn-cancel-user-modal'),
        btnSaveModal: document.getElementById('btn-save-user-modal'),
        form: document.getElementById('admin-user-form'),
        inputUsername: document.getElementById('form-user-username'),
        inputPassword: document.getElementById('form-user-password'),
        inputName: document.getElementById('form-user-name'),
        selectRole: document.getElementById('form-user-role'),
        selectAvatar: document.getElementById('form-user-avatar')
    };

    function renderUsersList() {
        if (!userDOM.tableBody) return;
        const users = Students.getAll();
        userDOM.tableBody.innerHTML = '';

        users.forEach((user, idx) => {
            const tr = document.createElement('tr');
            
            const isBlocked = user.blocked ? true : false;
            const statusBadge = isBlocked 
                ? '<span class="badge badge-danger" style="background-color: var(--danger-light); color: var(--danger); font-weight: 700;">Đã Khoá</span>' 
                : '<span class="badge badge-success" style="background-color: var(--success-light); color: var(--success); font-weight: 700;">Hoạt Động</span>';

            const roleBadgeColor = user.role === 'admin' ? 'badge-danger' : (user.role === 'teacher' ? 'badge-info' : 'badge-primary');
            const roleBadgeStyle = user.role === 'admin' 
                ? 'background-color: var(--danger-light); color: var(--danger);' 
                : (user.role === 'teacher' ? 'background-color: var(--info-light); color: var(--info);' : 'background-color: var(--primary-light); color: var(--primary);');
            
            const roleBadge = `<span class="badge ${roleBadgeColor}" style="${roleBadgeStyle} font-weight: 700;">${user.role.toUpperCase()}</span>`;
            
            const avatarIcon = user.avatar === 'user-shield' ? 'fa-user-shield' : (user.avatar === 'user-astronaut' ? 'fa-user-astronaut' : (user.avatar === 'user-ninja' ? 'fa-user-ninja' : 'fa-user-graduate'));

            // Actions HTML
            let actionButtons = '';
            if (user.username === 'admin') {
                actionButtons = `<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">Quyền Tối Cao (Không thể sửa)</span>`;
            } else if (user.role === 'admin' && currentUser.role === 'teacher') {
                actionButtons = `<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">Quản trị viên (Không thể sửa)</span>`;
            } else {
                const blockIcon = isBlocked ? 'fa-unlock' : 'fa-lock';
                const blockTitle = isBlocked ? 'Mở khoá tài khoản' : 'Khoá tài khoản';
                const blockClass = isBlocked ? 'btn-outline-success' : 'btn-outline-warning';
                
                actionButtons = `
                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                        <button class="btn btn-sm ${blockClass} btn-toggle-block-user" data-username="${user.username}" title="${blockTitle}" style="padding: 4px 8px;">
                            <i class="fa-solid ${blockIcon}"></i>
                        </button>
                        <select class="select-change-role" data-username="${user.username}" style="padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 11px; background: var(--bg-primary); color: var(--text-primary);">
                            <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                            <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                        <button class="btn btn-sm btn-outline-danger btn-delete-user" data-username="${user.username}" title="Xoá vĩnh viễn tài khoản" style="padding: 4px 8px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
            }

            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td><i class="fa-solid ${avatarIcon}" style="font-size: 18px; color: var(--primary);"></i></td>
                <td style="font-weight: 700;">${user.username}</td>
                <td>${user.name}</td>
                <td>${roleBadge}</td>
                <td style="font-size: 12px; color: var(--text-muted);">${new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                <td>${statusBadge}</td>
                <td style="text-align: center;">${actionButtons}</td>
            `;

            userDOM.tableBody.appendChild(tr);
        });

        // Bind Dynamic Action Events
        document.querySelectorAll('.btn-toggle-block-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.getAttribute('data-username');
                const result = Students.toggleBlock(username);
                if (result.success) {
                    showToast(`Đã ${result.blocked ? 'khoá' : 'kích hoạt lại'} tài khoản ${username}!`, result.blocked ? "warning" : "success");
                    renderUsersList();
                } else {
                    showToast(result.message, "error");
                }
            });
        });

        document.querySelectorAll('.select-change-role').forEach(sel => {
            sel.addEventListener('change', () => {
                const username = sel.getAttribute('data-username');
                const newRole = sel.value;
                const result = Students.updateRole(username, newRole);
                if (result.success) {
                    showToast(`Đã cập nhật quyền tài khoản ${username} thành ${newRole.toUpperCase()}!`, "success");
                    renderUsersList();
                } else {
                    showToast(result.message, "error");
                }
            });
        });

        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.getAttribute('data-username');
                if (confirm(`Bạn thực sự muốn xoá vĩnh viễn tài khoản "${username}" khỏi hệ thống?`)) {
                    const result = Students.deleteUser(username);
                    if (result.success) {
                        showToast(`Đã xoá tài khoản ${username} thành công!`, "success");
                        renderUsersList();
                    } else {
                        showToast(result.message, "error");
                    }
                }
            });
        });
    }

    if (userDOM.btnAddUser) {
        userDOM.btnAddUser.addEventListener('click', () => {
            userDOM.form.reset();
            userDOM.modalUser.classList.add('active');
        });
    }

    function closeUserModal() {
        if (userDOM.modalUser) userDOM.modalUser.classList.remove('active');
    }

    if (userDOM.btnCloseModal) userDOM.btnCloseModal.addEventListener('click', closeUserModal);
    if (userDOM.btnCancelModal) userDOM.btnCancelModal.addEventListener('click', closeUserModal);

    if (userDOM.btnSaveModal) {
        userDOM.btnSaveModal.addEventListener('click', (e) => {
            e.preventDefault();
            if (!userDOM.form.checkValidity()) {
                userDOM.form.reportValidity();
                return;
            }

            const username = userDOM.inputUsername.value.trim();
            const password = userDOM.inputPassword.value;
            const name = userDOM.inputName.value.trim();
            const role = userDOM.selectRole.value;
            const avatar = userDOM.selectAvatar.value;

            const res = Students.createAccountByAdmin(username, password, name, role, avatar);
            if (res.success) {
                showToast(`Đã tạo tài khoản "${username}" với quyền ${role.toUpperCase()} thành công!`, "success");
                closeUserModal();
                renderUsersList();
            } else {
                showToast(res.message, "error");
            }
        });
    }

    // ==========================================================================
    // --- 9.8 EXAM SCHEDULE & TIMING CONFIGURATION CONTROLLER ---
    // ==========================================================================
    const schedDOM = {
        selectExam: document.getElementById('settings-select-exam'),
        inputStart: document.getElementById('settings-start-date'),
        inputEnd: document.getElementById('settings-end-date'),
        btnSave: document.getElementById('btn-settings-save-schedule'),
        btnClear: document.getElementById('btn-settings-clear-schedule')
    };

    function populateSettingsExams() {
        if (!schedDOM.selectExam) return;
        schedDOM.selectExam.innerHTML = '<option value="">-- Chọn đề thi cần lên lịch --</option>';
        state.exams.forEach(exam => {
            const opt = document.createElement('option');
            opt.value = exam.id;
            opt.textContent = `${exam.subject} - ${exam.title}`;
            schedDOM.selectExam.appendChild(opt);
        });
    }

    if (schedDOM.selectExam) {
        schedDOM.selectExam.addEventListener('change', () => {
            const examId = schedDOM.selectExam.value;
            if (!examId) {
                schedDOM.inputStart.value = '';
                schedDOM.inputEnd.value = '';
                return;
            }
            const exam = state.exams.find(e => e.id === examId);
            if (exam) {
                schedDOM.inputStart.value = exam.startDate || '';
                schedDOM.inputEnd.value = exam.endDate || '';
            }
        });
    }

    if (schedDOM.btnSave) {
        schedDOM.btnSave.addEventListener('click', () => {
            const examId = schedDOM.selectExam.value;
            if (!examId) {
                showToast("Vui lòng chọn một đề thi cụ thể để lên lịch!", "warning");
                return;
            }
            const startVal = schedDOM.inputStart.value;
            const endVal = schedDOM.inputEnd.value;

            if (startVal && endVal && new Date(startVal) >= new Date(endVal)) {
                showToast("Thời gian mở đề bắt buộc phải sớm hơn thời gian đóng đề!", "error");
                return;
            }

            const idx = state.exams.findIndex(e => e.id === examId);
            if (idx !== -1) {
                state.exams[idx].startDate = startVal;
                state.exams[idx].endDate = endVal;
                localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
                showToast(`Lên lịch thi cho đề "${state.exams[idx].title}" thành công!`, "success");
                renderExamsList();
            }
        });
    }

    if (schedDOM.btnClear) {
        schedDOM.btnClear.addEventListener('click', () => {
            const examId = schedDOM.selectExam.value;
            if (!examId) {
                showToast("Vui lòng chọn đề thi để gỡ bỏ lịch!", "warning");
                return;
            }
            const idx = state.exams.findIndex(e => e.id === examId);
            if (idx !== -1) {
                delete state.exams[idx].startDate;
                delete state.exams[idx].endDate;
                localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
                schedDOM.inputStart.value = '';
                schedDOM.inputEnd.value = '';
                showToast(`Đã gỡ bỏ giới hạn thời gian mở/đóng của đề thi thành công!`, "info");
                renderExamsList();
            }
        });
    }

    // ==========================================================================
    // --- 9.9 ANTI-CHEAT CONFIGURATION ENGINE ---
    // ==========================================================================
    const cheatDOM = {
        tabSwitch: document.getElementById('anticheat-tab-switch'),
        disableCopy: document.getElementById('anticheat-disable-copy'),
        fullscreen: document.getElementById('anticheat-fullscreen'),
        btnSave: document.getElementById('btn-save-anticheat-config')
    };

    function loadAntiCheatConfig() {
        const saved = localStorage.getItem('quizflow_anticheat_config');
        const config = saved ? JSON.parse(saved) : { tabSwitch: true, disableCopy: true, fullscreen: true };
        
        if (cheatDOM.tabSwitch) cheatDOM.tabSwitch.checked = config.tabSwitch;
        if (cheatDOM.disableCopy) cheatDOM.disableCopy.checked = config.disableCopy;
        if (cheatDOM.fullscreen) cheatDOM.fullscreen.checked = config.fullscreen;
    }

    if (cheatDOM.btnSave) {
        cheatDOM.btnSave.addEventListener('click', () => {
            const config = {
                tabSwitch: cheatDOM.tabSwitch ? cheatDOM.tabSwitch.checked : true,
                disableCopy: cheatDOM.disableCopy ? cheatDOM.disableCopy.checked : true,
                fullscreen: cheatDOM.fullscreen ? cheatDOM.fullscreen.checked : true
            };
            localStorage.setItem('quizflow_anticheat_config', JSON.stringify(config));
            showToast("Đã lưu và áp dụng cấu hình chống gian lận (Anti-Cheat) thành công!", "success");
        });
    }

    // ==========================================================================
    // --- 9.10 BULK QUESTION TEXT/EXCEL-LIKE IMPORTER ---
    // ==========================================================================
    const bulkDOM = {
        btnBulk: document.getElementById('btn-admin-bulk-import'),
        modalBulk: document.getElementById('modal-bulk-import'),
        btnClose: document.getElementById('btn-close-bulk-modal'),
        btnCancel: document.getElementById('btn-cancel-bulk-modal'),
        btnSubmit: document.getElementById('btn-submit-bulk-modal'),
        textarea: document.getElementById('bulk-import-textarea')
    };

    // Toggle Bulk Import Button based on selected exam
    function updateBulkImportButtonState(selectedExamId) {
        if (bulkDOM.btnBulk) {
            bulkDOM.btnBulk.disabled = !selectedExamId;
        }
    }

    // Hook in selectExam method to trigger state update
    const originalSelectExam = selectExam;
    selectExam = function(examId) {
        originalSelectExam(examId);
        updateBulkImportButtonState(examId);
    };

    if (bulkDOM.btnBulk) {
        bulkDOM.btnBulk.addEventListener('click', () => {
            if (!state.selectedExamId) {
                showToast("Vui lòng chọn một đề thi để nhập câu hỏi!", "warning");
                return;
            }
            bulkDOM.textarea.value = '';
            bulkDOM.modalBulk.classList.add('active');
        });
    }

    function closeBulkModal() {
        if (bulkDOM.modalBulk) bulkDOM.modalBulk.classList.remove('active');
    }

    if (bulkDOM.btnClose) bulkDOM.btnClose.addEventListener('click', closeBulkModal);
    if (bulkDOM.btnCancel) bulkDOM.btnCancel.addEventListener('click', closeBulkModal);

    if (bulkDOM.btnSubmit) {
        bulkDOM.btnSubmit.addEventListener('click', () => {
            const rawText = bulkDOM.textarea.value.trim();
            if (!rawText) {
                showToast("Vui lòng dán câu hỏi theo định dạng mẫu!", "warning");
                return;
            }

            const examId = state.selectedExamId;
            const examIdx = state.exams.findIndex(e => e.id === examId);
            if (examIdx === -1) return;

            // Simple robust regex parser for question blocks
            const blocks = rawText.split(/\n\s*\n+/);
            let importedCount = 0;

            blocks.forEach(block => {
                const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length < 5) return; // Must have question + options + correct answer

                let questionText = "";
                let options = ["", "", "", ""];
                let correctIndex = 0;
                let explanation = "";

                lines.forEach(line => {
                    const lowerLine = line.toLowerCase();
                    if (lowerLine.startsWith('câu hỏi:') || lowerLine.startsWith('cau hoi:')) {
                        questionText = line.substring(line.indexOf(':') + 1).trim();
                    } else if (lowerLine.startsWith('a:')) {
                        options[0] = line.substring(2).trim();
                    } else if (lowerLine.startsWith('b:')) {
                        options[1] = line.substring(2).trim();
                    } else if (lowerLine.startsWith('c:')) {
                        options[2] = line.substring(2).trim();
                    } else if (lowerLine.startsWith('d:')) {
                        options[3] = line.substring(2).trim();
                    } else if (lowerLine.startsWith('đáp án đúng:') || lowerLine.startsWith('dap an dung:') || lowerLine.startsWith('đáp án:') || lowerLine.startsWith('dap an:')) {
                        const correctStr = line.substring(line.indexOf(':') + 1).trim().toUpperCase();
                        if (correctStr.includes('A')) correctIndex = 0;
                        else if (correctStr.includes('B')) correctIndex = 1;
                        else if (correctStr.includes('C')) correctIndex = 2;
                        else if (correctStr.includes('D')) correctIndex = 3;
                    } else if (lowerLine.startsWith('giải thích:') || lowerLine.startsWith('giai thich:')) {
                        explanation = line.substring(line.indexOf(':') + 1).trim();
                    }
                });

                if (questionText && options.every(o => o !== "")) {
                    const newQuestion = {
                        id: "q-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
                        question: questionText,
                        options: options,
                        correct: correctIndex,
                        explanation: explanation
                    };
                    state.exams[examIdx].questions.push(newQuestion);
                    importedCount++;
                }
            });

            if (importedCount > 0) {
                localStorage.setItem('quizflow_exams', JSON.stringify(state.exams));
                showToast(`Đã nhập thành công ${importedCount} câu hỏi mới vào đề thi!`, "success");
                closeBulkModal();
                selectExam(examId); // Refresh questions view
                recalculateAnalytics();
                renderExamsList();
            } else {
                showToast("Không tìm thấy khối câu hỏi hợp lệ! Vui lòng kiểm tra lại định dạng.", "error");
            }
        });
    }

    // --- 10. PAGE INITS ---
    recalculateAnalytics();
    renderExamsList();
    renderGlobalAttempts();
});
