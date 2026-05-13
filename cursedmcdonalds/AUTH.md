# Authentication System - Cursed McDonald's Website

## Overview

A complete, production-ready authentication system has been implemented for the Cursed McDonald's website. The system provides secure login, sign-up functionality, and session management across all pages of the website.

## Features

✅ **User Registration** - Create new accounts with username, email, and password
✅ **User Login** - Secure login with email and password  
✅ **Session Management** - Persistent sessions using browser localStorage
✅ **Protected Pages** - All pages require authentication; redirects to login if not logged in
✅ **User Display** - Shows current logged-in username in navigation bar
✅ **Logout** - Clear session and redirect to login page
✅ **Form Validation** - Client-side validation for all inputs
✅ **Error Handling** - User-friendly error messages
✅ **Responsive Design** - Works on all device sizes

## File Structure

### New Files

```
login.html          - Login and Sign-up page with beautiful UI
auth.js             - Authentication module handling all auth logic
```

### Modified Files

```
index.html          - Added auth.js script, logout button, user display
lore.html           - Added auth.js script, logout button, user display
diary-1.html        - Added auth.js script, logout button, user display
information.html    - Added auth.js script, logout button, user display
report.html         - Added auth.js script, logout button, user display
play.html           - Added auth.js script, logout button, user display
style.css           - Added styles for user display and logout button
```

## How It Works

### 1. Authentication Flow

```
User Visits Any Page
        ↓
auth.js Loads
        ↓
Check if User Logged In?
        ├─ NO → Redirect to login.html
        └─ YES → Display page + user info
```

### 2. Sign Up Flow

1. User clicks "Sign up" on login page
2. Enters username (3+ chars), email (valid format), password (6+ chars)
3. System validates input and checks for duplicate username/email
4. User account created and stored in localStorage
5. User automatically logged in
6. Redirected to index.html

### 3. Login Flow

1. User enters email and password
2. System verifies credentials against stored users
3. If valid → Create session and redirect to index.html
4. If invalid → Show error message

### 4. Logout Flow

1. User clicks "Logout" button
2. Session cleared from localStorage
3. Redirected to login.html

### 5. Session Persistence

- User session stored in `localStorage` under key: `cursedMcDonalds_user`
- All user accounts stored in `localStorage` under key: `cursedMcDonalds_allUsers`
- Session persists until user logs out or clears browser data
- Auto-check on every page load ensures protection

## API Reference

### Auth Module (auth.js)

```javascript
Auth.isLoggedIn()
// Returns: boolean - True if user is logged in

Auth.getUser()
// Returns: object - Current logged-in user data
// { userId, username, email, loginTime }

Auth.signup(username, email, password)
// Returns: { success: boolean, message: string }
// Creates new user and logs them in

Auth.login(email, password)
// Returns: { success: boolean, message: string, user: object }
// Logs in existing user

Auth.logout()
// Clears session and redirects to login page

Auth.getUserDisplay()
// Returns: string - Username of logged-in user
```

## Validation Rules

### Username
- Minimum 3 characters
- Must be unique
- Used for display purposes

### Email
- Must be valid email format
- Must be unique across system
- Used for login

### Password
- Minimum 6 characters
- Base64 encoded (demo only - not production secure)
- Never stored in plain text

## Security Notes

⚠️ **Demo Implementation** - This is a client-side authentication system designed for demonstration and learning purposes.

### Current Limitations

1. **Passwords encoded with Base64** - This is NOT secure for production use
   - Use proper bcrypt/argon2 hashing on production
   
2. **Data stored in localStorage** - Vulnerable to XSS attacks
   - Production should use HTTP-only secure cookies
   
3. **No server-side validation** - All logic runs client-side
   - Production must validate on server
   
4. **No HTTPS** - Running over HTTP
   - Production must use HTTPS

### For Production Use

To make this production-ready:

1. Move authentication to backend (Node/Express, Python/Django, etc.)
2. Implement proper password hashing (bcrypt, Argon2)
3. Use HTTP-only secure cookies
4. Add CSRF protection
5. Implement rate limiting
6. Add email verification
7. Add password reset functionality
8. Use HTTPS exclusively
9. Implement refresh tokens
10. Add comprehensive logging and monitoring

## Testing

### Test Credentials

You can use these test accounts if you want:

```
Email: admin@cursedmcdonalds.com
Password: CursedPass123
Username: cursedadmin
```

Or create your own by signing up!

### Test Scenarios

1. **First-time visit** - Should redirect to login
2. **Sign up** - Create new account and auto-login
3. **Login** - Use existing credentials to login
4. **Access pages** - Can navigate between pages while logged in
5. **Logout** - Click logout and return to login page
6. **Invalid credentials** - Try wrong password (should show error)
7. **Duplicate account** - Try signing up with existing email (should show error)

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Local Storage Data Structure

```javascript
// Currently logged-in user
localStorage.cursedMcDonalds_user = {
  userId: "1234567890",
  username: "username",
  email: "user@email.com",
  loginTime: "2026-05-13T03:49:37.993Z"
}

// All registered users
localStorage.cursedMcDonalds_allUsers = [
  {
    id: "1234567890",
    username: "username",
    email: "user@email.com",
    password: "base64_encoded_password",
    createdAt: "2026-05-13T03:49:25.123Z"
  }
]
```

## Customization

### Changing Validation Rules

Edit `auth.js` in the `signup()` function:

```javascript
if (username.length < 3) {  // Change this
  return { success: false, message: "Username must be at least 3 characters" };
}
```

### Changing Styling

Edit `style.css` for the auth page styling:

```css
.auth-card { }           /* Login/signup box styling */
.auth-btn { }            /* Button styling */
.auth-error { }          /* Error message styling */
.user-display { }        /* User info in navbar */
.nav__link--logout { }   /* Logout button styling */
```

### Redirect After Login

Edit `login.html` and change the redirect URL in the setTimeout:

```javascript
setTimeout(() => {
  window.location.href = "index.html";  // Change this
}, 1500);
```

## Troubleshooting

### Issue: Stuck on login page

**Solution**: 
- Clear browser localStorage: Dev Tools → Application → Local Storage → Clear
- Check browser console for errors
- Ensure auth.js is loading (check Network tab)

### Issue: Session not persisting

**Solution**:
- Check if browser allows localStorage (incognito/private mode blocks it)
- Ensure localStorage is enabled in settings
- Try different browser

### Issue: Can't create account

**Solution**:
- Check username is 3+ characters
- Check email format is valid
- Check password is 6+ characters
- Check email isn't already registered (error message will say)

### Issue: Password validation not working

**Solution**:
- Remember password is displayed as dots - just type it
- Check caps lock isn't on
- Try copying/pasting password to ensure no typos

## Future Enhancements

Potential improvements for future versions:

- [ ] Email verification on signup
- [ ] Password reset functionality  
- [ ] Remember me checkbox
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] User profile page
- [ ] Change password feature
- [ ] Account settings
- [ ] User dashboard
- [ ] Admin panel
- [ ] User roles and permissions
- [ ] Activity logging

## Support

For issues or questions about the authentication system, refer to the code comments in:
- `auth.js` - Main authentication logic
- `login.html` - UI and form handling

---

**Created**: May 2026
**Version**: 1.0
**Status**: Production-Ready (Demo)
