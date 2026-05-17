/* ==========================================================================
   QUIZFLOW ROUTE GUARD AND AUTHENTICATION MIDDLEWARE
   Protects page routes, validates permissions, and initializes active profile views.
   ========================================================================== */

(function() {
    // 1. Check if user is logged in
    const currentUser = Students.getCurrentUser();
    const path = window.location.pathname.toLowerCase();
    const isTrangCon = path.includes('trangcon');
    
    // Determine relative paths for redirections (robust check for file:// and http://)
    const loginPage = isTrangCon ? '../login.html' : 'login.html';
    const dashboardPage = isTrangCon ? '../index.html' : 'index.html';

    if (!currentUser) {
        // Not logged in: redirect to login
        if (!path.includes('login.html') && !path.includes('register.html')) {
            window.location.href = loginPage;
            return;
        }
    } else {
        // Logged in: if trying to access login/register, redirect to dashboard
        if (path.includes('login.html') || path.includes('register.html')) {
            window.location.href = dashboardPage;
            return;
        }

        // Role restriction: if on admin page, make sure user is an admin
        if (path.includes('admin.html') && currentUser.role !== 'admin') {
            alert("Bạn không có quyền truy cập trang quản trị!");
            window.location.href = dashboardPage;
            return;
        }
    }

    // 2. Global DOM initialization (runs once the document is loaded)
    function init() {
        // Find any .profile-widget on the active page
        const profileWidget = document.querySelector('.profile-widget');
        if (profileWidget && currentUser) {
            // Dynamically insert the chevron arrow if it is missing (admin.html, exam.html, result.html)
            if (!profileWidget.querySelector('.profile-arrow')) {
                const arrow = document.createElement('i');
                arrow.className = 'fa-solid fa-chevron-down profile-arrow';
                arrow.style.marginLeft = '8px';
                arrow.style.fontSize = '11px';
                arrow.style.color = 'var(--text-secondary)';
                arrow.style.transition = 'transform var(--transition-fast)';
                profileWidget.appendChild(arrow);
            }

            // Check if it already has a dropdown structure
            let dropdown = profileWidget.querySelector('.profile-dropdown');
            if (!dropdown) {
                // Dynamically build a beautiful, premium dropdown for pages lacking one (admin.html, exam.html, result.html)
                dropdown = document.createElement('div');
                dropdown.className = 'profile-dropdown';
                dropdown.id = 'profile-dropdown-content';
                dropdown.style.cssText = 'position: absolute; top: 52px; right: 0; width: 220px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 1100; display: none; flex-direction: column; overflow: hidden; padding: 8px 0; animation: dropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);';
                
                dropdown.innerHTML = `
                    <div style="padding: 10px 16px; border-bottom: 1px solid var(--border-color); font-size: 13px; font-weight: 700; color: var(--text-primary); text-align: left;">
                        ${currentUser.name}
                        <div style="font-size: 10px; color: var(--text-muted); font-weight: 500; margin-top: 2px;">
                            ${currentUser.role === 'admin' ? 'Quản trị viên' : 'Thí sinh'}
                        </div>
                    </div>
                    <a href="#" class="dropdown-item logout-btn" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #ef4444; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.2s; cursor: pointer; text-align: left;">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất tài khoản
                    </a>
                `;
                
                // Add hover style for dropdown-item
                const style = document.createElement('style');
                style.innerHTML = `
                    .profile-dropdown .dropdown-item:hover {
                        background: var(--bg-secondary) !important;
                    }
                    .profile-dropdown .logout-btn:hover {
                        background: rgba(244, 63, 94, 0.08) !important;
                        color: #e11d48 !important;
                    }
                `;
                document.head.appendChild(style);
                profileWidget.appendChild(dropdown);
            }

            // Click listener to toggle dropdown
            profileWidget.addEventListener('click', (e) => {
                if (e.target.closest('#profile-dropdown-content')) return;
                
                const isShown = dropdown.classList.contains('show') || dropdown.style.display === 'flex';
                if (isShown) {
                    dropdown.classList.remove('show');
                    dropdown.style.display = 'none';
                    profileWidget.classList.remove('active');
                } else {
                    dropdown.classList.add('show');
                    dropdown.style.display = 'flex';
                    profileWidget.classList.add('active');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileWidget.contains(e.target)) {
                    dropdown.classList.remove('show');
                    dropdown.style.display = 'none';
                    profileWidget.classList.remove('active');
                }
            });
        }

        // Wire up logout button if present
        const logoutBtns = document.querySelectorAll('.logout-btn, #logout-btn, #profile-logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Avoid double trigger toggle
                if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
                    Students.logout();
                }
            });
        });

        // Load active avatar/name in navigation headers if elements exist
        const headerAvatar = document.getElementById('user-avatar-preview');
        const headerName = document.getElementById('user-name-preview');
        const headerRole = document.getElementById('user-role-preview');
        const roleBadge = document.getElementById('user-role-badge');
        
        if (currentUser) {
            if (headerAvatar) {
                // Safety check to assign correct fontawesome icon structure
                headerAvatar.className = `fas fa-${currentUser.avatar}`;
            }
            if (headerName) {
                headerName.textContent = currentUser.name;
            }
            if (headerRole) {
                headerRole.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Thí sinh';
            }
            if (roleBadge) {
                roleBadge.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Thí sinh';
                roleBadge.style.background = currentUser.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-light)';
                roleBadge.style.color = currentUser.role === 'admin' ? '#ef4444' : 'var(--primary-dark)';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
