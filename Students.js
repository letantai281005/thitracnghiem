/* ==========================================================================
   QUIZFLOW STUDENT & AUTHENTICATION DATABASE ENGINE
   Handles account seeding, local storage persistence, login/signup sessions.
   ========================================================================== */

const Students = {
    // Default seed accounts loaded on first access
    SEED_ACCOUNTS: [
        {
            username: "admin",
            password: "123", // Simple standard password for easy testing
            name: "Quản Trị Viên",
            role: "admin",
            avatar: "user-shield",
            createdAt: new Date().toISOString()
        },
        {
            username: "student",
            password: "123",
            name: "Nguyễn Văn Học",
            role: "student",
            avatar: "user-graduate",
            createdAt: new Date().toISOString()
        }
    ],

    // Retrieve all registered accounts from local storage
    getAll: function() {
        let users = localStorage.getItem('quizflow_users');
        if (!users) {
            // Seed the initial accounts if empty
            localStorage.setItem('quizflow_users', JSON.stringify(this.SEED_ACCOUNTS));
            return this.SEED_ACCOUNTS;
        }
        return JSON.parse(users);
    },

    // Check login credentials and create session
    login: function(username, password) {
        const users = this.getAll();
        const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
        
        if (found) {
            if (found.blocked) {
                return { success: false, message: "Tài khoản của bạn đã bị khoá bởi Admin! Vui lòng liên hệ hỗ trợ." };
            }
            // Set current session
            const sessionData = {
                username: found.username,
                name: found.name,
                role: found.role,
                avatar: found.avatar,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('quizflow_session', JSON.stringify(sessionData));
            return { success: true, user: sessionData };
        }
        return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác." };
    },

    // Register a new account (student or teacher)
    register: function(username, password, name, avatar = "user-graduate", role = "student") {
        if (!username || !password || !name) {
            return { success: false, message: "Vui lòng điền đầy đủ tất cả thông tin." };
        }
        
        const users = this.getAll();
        const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
        
        if (exists) {
            return { success: false, message: "Tên đăng nhập đã tồn tại trong hệ thống." };
        }
 
        const newUser = {
            username: username.trim(),
            password: password,
            name: name.trim(),
            role: role, // Dynamically assign selected role (student or teacher)
            avatar: avatar,
            blocked: false,
            createdAt: new Date().toISOString()
        };
 
        users.push(newUser);
        localStorage.setItem('quizflow_users', JSON.stringify(users));
        return { success: true };
    },

    // Admin: Create or register any user role
    createAccountByAdmin: function(username, password, name, role = "student", avatar = "user-graduate") {
        if (!username || !password || !name) {
            return { success: false, message: "Vui lòng điền đầy đủ tất cả thông tin." };
        }
        const users = this.getAll();
        const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (exists) {
            return { success: false, message: "Tên đăng nhập đã tồn tại." };
        }
        const newUser = {
            username: username.trim(),
            password: password,
            name: name.trim(),
            role: role,
            avatar: avatar,
            blocked: false,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('quizflow_users', JSON.stringify(users));
        return { success: true };
    },

    // Toggle blocking status of a user
    toggleBlock: function(username) {
        const users = this.getAll();
        const idx = users.findIndex(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (idx !== -1) {
            if (users[idx].username === 'admin' || users[idx].role === 'admin') {
                return { success: false, message: "Không thể khoá tài khoản Quản trị viên!" };
            }
            users[idx].blocked = !users[idx].blocked;
            localStorage.setItem('quizflow_users', JSON.stringify(users));
            return { success: true, blocked: users[idx].blocked };
        }
        return { success: false, message: "Tài khoản không tồn tại." };
    },

    // Change user role
    updateRole: function(username, newRole) {
        const users = this.getAll();
        const idx = users.findIndex(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (idx !== -1) {
            if (users[idx].username === 'admin' || users[idx].role === 'admin') {
                return { success: false, message: "Không thể thay đổi quyền của tài khoản Quản trị viên!" };
            }
            users[idx].role = newRole;
            localStorage.setItem('quizflow_users', JSON.stringify(users));
            return { success: true };
        }
        return { success: false, message: "Tài khoản không tồn tại." };
    },

    // Delete a user
    deleteUser: function(username) {
        const users = this.getAll();
        const idx = users.findIndex(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (idx !== -1) {
            if (users[idx].username === 'admin' || users[idx].role === 'admin') {
                return { success: false, message: "Không thể xoá tài khoản Admin!" };
            }
            users.splice(idx, 1);
            localStorage.setItem('quizflow_users', JSON.stringify(users));
            return { success: true };
        }
        return { success: false, message: "Tài khoản không tồn tại." };
    },

    // Get current active session
    getCurrentUser: function() {
        const session = localStorage.getItem('quizflow_session');
        return session ? JSON.parse(session) : null;
    },

    // Destroy active session (logout)
    logout: function() {
        localStorage.removeItem('quizflow_session');
        // Redirect to login page based on current directory level (robust check for file:// and http://)
        const path = window.location.pathname.toLowerCase();
        if (path.includes('trangcon')) {
            window.location.href = '../login.html';
        } else {
            window.location.href = 'login.html';
        }
    },

    // Update active student profile
    updateProfile: function(name, avatar) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: "Chưa đăng nhập." };

        // 1. Update session
        currentUser.name = name.trim();
        currentUser.avatar = avatar;
        localStorage.setItem('quizflow_session', JSON.stringify(currentUser));

        // 2. Update in user database
        const users = this.getAll();
        const userIndex = users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
        if (userIndex !== -1) {
            users[userIndex].name = name.trim();
            users[userIndex].avatar = avatar;
            localStorage.setItem('quizflow_users', JSON.stringify(users));
        }

        return { success: true, user: currentUser };
    }
};

// Initialize seeding automatically
Students.getAll();

// Global event delegation for all logout buttons to bypass any timing, caching, or propagation issues
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.logout-btn, #logout-btn, #profile-logout-btn');
    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        Students.logout();
    }
}, true); // Capture phase ensures this runs first and reliably
