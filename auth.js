/**
 * Authentication Module
 * Handles login, sign up, and session management
 * Supports both localStorage (demo) and server-based auth (production)
 */

const Auth = (() => {
  const STORAGE_KEY = "cursedMcDonalds_user";
  const SESSION_KEY = "cursedMcDonalds_session";
  const TOKEN_KEY = "cursedMcDonalds_token";
  
  // Configuration
  const API_BASE_URL = 'http://localhost:5000';
  const USE_SERVER = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  /**
   * Initialize auth on page load
   */
  const init = () => {
    // Update UI based on login status (shows login button if not logged in)
    updateUIWithUser();
  };

  /**
   * Check if user is logged in
   */
  const isLoggedIn = () => {
    return !!getUser();
  };

  /**
   * Get current user from storage
   */
  const getUser = () => {
    try {
      const user = localStorage.getItem(STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Error reading user from storage:", e);
      return null;
    }
  };

  /**
   * Sign up new user
   */
  const signup = async (username, email, password) => {
    // Validation
    if (!username || !email || !password) {
      return { success: false, message: "All fields are required" };
    }

    if (username.length < 3) {
      return { success: false, message: "Username must be at least 3 characters" };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Invalid email format" };
    }

    try {
      // Try server-based signup first
      if (USE_SERVER) {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();
        
        if (result.success) {
          // Save token
          localStorage.setItem(TOKEN_KEY, result.token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
          return result;
        } else {
          return result;
        }
      }
    } catch (e) {
      console.log('Server unavailable, using localStorage fallback');
    }

    // Fallback to localStorage (demo mode)
    // Check if user already exists
    const allUsers = getAllUsers();
    if (allUsers.some((u) => u.email === email || u.username === username)) {
      return { success: false, message: "Username or email already exists" };
    }

    // Create new user (in real app, this would be server-side)
    const newUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      password: btoa(password), // Simple encoding (NOT secure - for demo only)
      provider: 'local',
      createdAt: new Date().toISOString(),
    };

    // Save all users
    allUsers.push(newUser);
    localStorage.setItem("cursedMcDonalds_allUsers", JSON.stringify(allUsers));

    // Log in the new user
    return login(email, password);
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    // Validation
    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    try {
      // Try server-based login first
      if (USE_SERVER) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
          // Save token
          localStorage.setItem(TOKEN_KEY, result.token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
          return result;
        } else {
          return result;
        }
      }
    } catch (e) {
      console.log('Server unavailable, using localStorage fallback');
    }

    // Fallback to localStorage (demo mode)
    // Find user
    const allUsers = getAllUsers();
    const user = allUsers.find((u) => u.email === email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check password
    if (btoa(password) !== user.password) {
      return { success: false, message: "Invalid password" };
    }

    // Create session
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email,
      provider: user.provider || 'local',
      loginTime: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, message: "Login successful", user: session };
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    // Reload page to update UI instead of redirecting to login
    window.location.reload();
  };

  /**
   * Get all users (for demo purposes)
   */
  const getAllUsers = () => {
    try {
      const users = localStorage.getItem("cursedMcDonalds_allUsers");
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  /**
   * Update UI with user information
   */
  const updateUIWithUser = () => {
    const user = getUser();
    const userDisplay = document.querySelector(".user-display");
    const logoutBtn = document.querySelector("[data-logout-btn]");
    
    if (user) {
      // Show user display and logout button
      if (userDisplay) userDisplay.style.display = "";
      if (logoutBtn) logoutBtn.style.display = "";
      
      // Update any user display elements
      const userElements = document.querySelectorAll("[data-user-display]");
      userElements.forEach((el) => {
        el.textContent = user.username;
      });

      // Add logout button listener
      if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
      }
    } else {
      // Hide user display and logout button when not logged in
      if (userDisplay) userDisplay.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      
      // Show login link instead
      let loginLink = document.querySelector("[data-login-btn]");
      if (!loginLink) {
        const nav = document.querySelector(".nav");
        if (nav) {
          loginLink = document.createElement("a");
          loginLink.className = "nav__link";
          loginLink.href = "login.html";
          loginLink.textContent = "Sign In";
          loginLink.setAttribute("data-login-btn", "");
          nav.appendChild(loginLink);
        }
      }
    }
  };

  /**
   * Get user display info
   */
  const getUserDisplay = () => {
    const user = getUser();
    return user ? `${user.username}` : null;
  };

  /**
   * Google OAuth callback
   */
  const loginWithGoogle = async (googleData) => {
    if (!googleData) {
      return { success: false, message: "Google authentication failed" };
    }

    try {
      if (USE_SERVER) {
        const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: googleData.sub,
            email: googleData.email,
            name: googleData.name,
            picture: googleData.picture
          })
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem(TOKEN_KEY, result.token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        }

        return result;
      }
    } catch (e) {
      console.error('Google login error:', e);
      return { success: false, message: "Google login failed" };
    }
  };

  /**
   * Microsoft OAuth callback
   */
  const loginWithMicrosoft = async (microsoftData) => {
    if (!microsoftData) {
      return { success: false, message: "Microsoft authentication failed" };
    }

    try {
      if (USE_SERVER) {
        const response = await fetch(`${API_BASE_URL}/api/auth/microsoft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            microsoftId: microsoftData.objectId,
            email: microsoftData.userPrincipalName || microsoftData.mail,
            name: microsoftData.displayName,
            picture: null
          })
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem(TOKEN_KEY, result.token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        }

        return result;
      }
    } catch (e) {
      console.error('Microsoft login error:', e);
      return { success: false, message: "Microsoft login failed" };
    }
  };

  return {
    init,
    isLoggedIn,
    getUser,
    signup,
    login,
    logout,
    updateUIWithUser,
    getUserDisplay,
    loginWithGoogle,
    loginWithMicrosoft,
  };
})();

// Auto-initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", Auth.init);
} else {
  Auth.init();
}
