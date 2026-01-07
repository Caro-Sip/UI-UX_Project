// Authentication Management System
// Uses localStorage for persistent storage across sessions

// Initialize auth system
function initAuth() {
    // Create users storage if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Sign up new user
function signUp(email, password) {
    initAuth();
    
    // Validation
    if (!email || !password) {
        return { success: false, message: 'Please fill in all fields' };
    }
    
    if (!isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return { success: false, message: 'An account with this email already exists' };
    }
    
    // Create new user
    const newUser = {
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Account created successfully!' };
}

// Login user
function login(email, password) {
    initAuth();
    
    // Validation
    if (!email || !password) {
        return { success: false, message: 'Please fill in all fields' };
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }
    
    // Create session
    sessionStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        loginTime: new Date().toISOString()
    }));
    
    return { success: true, message: 'Login successful!', user: user };
}

// Logout user
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Require authentication (redirect to login if not authenticated)
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'Login.html';
        return false;
    }
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update navigation to show user info or login
function updateNavigation() {
    const navLink = document.querySelector('.nav-link');
    if (!navLink) return;
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        navLink.innerHTML = `
            ${user.email.split('@')[0]} <i class="fa-regular fa-circle-user" style="font-size: x-large;"></i>
        `;
        navLink.href = '#';
        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        });
    } else {
        navLink.innerHTML = `
            Login <i class="fa-regular fa-circle-user" style="font-size: x-large;"></i>
        `;
        navLink.href = 'Login.html';
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.auth-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `auth-toast auth-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
