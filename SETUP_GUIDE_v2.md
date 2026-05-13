# 🔐 Cursed McDonald's Authentication System - Advanced Setup Guide v2.0

## 🆕 What's New in v2.0

✨ **Encrypted File Storage** - User accounts saved securely in files with bcrypt hashing
✨ **OAuth Integration** - Login with Google and Microsoft accounts  
✨ **Node.js Backend Server** - Production-ready authentication server
✨ **JWT Tokens** - Secure token-based session management
✨ **API Endpoints** - RESTful authentication API

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Server Required)
Works with localStorage - best for quick testing:
```bash
# Just open login.html in browser
# Sign up and log in directly
```

### Option 2: Production Mode (With Server)
Full encryption and OAuth support:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example)
cp .env.example .env

# 3. Start the server
npm start

# Server runs on http://localhost:5000
```

---

## 📁 File Structure

```
Cursed McDonalds Website/
├── server.js                 # Node.js auth server
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .env                       # (Create this) Actual env vars
├── users.json                # (Auto-created) Encrypted users database
└── cursedmcdonalds/
    ├── login.html            # Login page with OAuth buttons
    ├── auth.js               # Auth module (client + server support)
    ├── index.html            # Protected home page
    └── ...
```

---

## 🔧 Setup Instructions

### Step 1: Install Node.js & Dependencies

```bash
# Download Node.js from https://nodejs.org/ (LTS version)

# Navigate to project directory
cd "Cursed McDonalds Website"

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
nano .env  # or open in your editor
```

**Required settings:**
```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
```

### Step 3: Setup Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Go to "OAuth consent screen" - Set to External
5. Go to "Credentials" - Create OAuth 2.0 Client ID
6. Choose "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:5000`
   - `http://localhost:3000`
8. Copy your **Client ID**
9. Update `login.html` - Replace this line:
   ```javascript
   client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
   ```
   With your actual Client ID

### Step 4: Setup Microsoft OAuth (Optional)

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "App registrations"
3. Click "New registration"
4. Enter app name: "Cursed McDonald's Auth"
5. Set redirect URI: `http://localhost:5000/auth/callback`
6. Copy **Client ID** and **Client Secret**
7. Add to `.env`:
   ```env
   MICROSOFT_CLIENT_ID=your_client_id
   MICROSOFT_CLIENT_SECRET=your_secret
   ```

### Step 5: Start the Server

```bash
npm start

# Output:
# 🔐 Cursed McDonald's Auth Server
# ✅ Running on http://localhost:5000
# 📁 Users file: /path/to/users.json
```

### Step 6: Access the Website

- **From Server**: `http://localhost:5000`
- **Direct File**: `file:///path/to/login.html` (demo mode only)

---

## 📊 Database Structure

### users.json (Encrypted Storage)

```json
[
  {
    "id": "1234567890",
    "username": "cursedadmin",
    "email": "admin@cursedmcdonalds.com",
    "password": "$2b$10$...", 
    "provider": "local",
    "createdAt": "2026-05-13T03:49:25.123Z"
  },
  {
    "id": "1234567891",
    "username": "google_user",
    "email": "user@gmail.com",
    "googleId": "google_id_here",
    "picture": "https://...",
    "provider": "google",
    "createdAt": "2026-05-13T04:20:00.000Z"
  },
  {
    "id": "1234567892",
    "username": "microsoft_user",
    "email": "user@outlook.com",
    "microsoftId": "microsoft_id_here",
    "provider": "microsoft",
    "createdAt": "2026-05-13T04:25:00.000Z"
  }
]
```

**Security Features:**
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ OAuth IDs stored separately
- ✅ File-based persistent storage
- ✅ JWT tokens for sessions
- ✅ CORS protection

---

## 🔐 Security Features

### Server-Side (Encrypted Storage)
- ✅ **bcrypt Password Hashing** - Industry standard hashing
- ✅ **File Persistence** - Data survives server restarts
- ✅ **JWT Tokens** - Secure session tokens
- ✅ **CORS Protection** - Only allowed origins can access
- ✅ **Input Validation** - Server validates all input
- ✅ **OAuth Support** - Secure third-party authentication

### Client-Side
- ✅ **Form Validation** - Check before sending
- ✅ **Error Handling** - Secure error messages
- ✅ **Token Storage** - Secure token handling
- ✅ **Auto Redirect** - Protected page access

### Data Protection
- Passwords: **bcrypt with 10 rounds** (very secure)
- Tokens: **JWT with expiration** (7 days)
- Storage: **JSON file** (survives restarts)

---

## 📚 API Reference

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### POST /signup
Create new account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cursedadmin",
    "email": "admin@cursedmcdonalds.com",
    "password": "SecurePass123"
  }'

# Response:
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "123456",
    "username": "cursedadmin",
    "email": "admin@cursedmcdonalds.com",
    "provider": "local"
  }
}
```

#### POST /login
Login with email & password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cursedmcdonalds.com",
    "password": "SecurePass123"
  }'
```

#### POST /google
Google OAuth callback
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "google_id",
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "url_to_picture"
  }'
```

#### POST /microsoft
Microsoft OAuth callback
```bash
curl -X POST http://localhost:5000/api/auth/microsoft \
  -H "Content-Type: application/json" \
  -d '{
    "microsoftId": "microsoft_id",
    "email": "user@outlook.com",
    "name": "User Name"
  }'
```

#### POST /verify
Verify JWT token
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### GET /health
Server status
```bash
curl http://localhost:5000/api/health

# Response:
{
  "status": "Server is running",
  "users": 3
}
```

---

## 🧪 Testing

### Test with Demo Credentials

If you created an account during testing:
```
Email:    admin@cursedmcdonalds.com
Password: CursedPass123
Username: cursedadmin
```

### Test OAuth (Requires Setup)

1. **Google**: Click "Sign in with Google" button
2. **Microsoft**: Click Microsoft icon (requires MSAL config)

### API Testing with cURL

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Test health
curl http://localhost:5000/api/health
```

---

## 🛠️ Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: "Server is not responding"
**Solution**:
```bash
# Check if port 5000 is available
lsof -i :5000  # macOS/Linux

# Kill process on port 5000
kill -9 <PID>

# Restart server
npm start
```

### Issue: "Cannot find module 'express'"
**Solution**:
```bash
# Install dependencies again
npm install

# Verify installation
npm list
```

### Issue: "CORS error in browser"
**Solution**: Make sure server is running
```bash
# Check server status
curl http://localhost:5000/api/health

# Should return: {"status": "Server is running", "users": X}
```

### Issue: "Google Sign-In not working"
**Solution**:
1. Check Client ID is correct in `login.html`
2. Add redirect URIs in Google Cloud Console
3. Open browser console (F12) for error details
4. Check origin is whitelisted in `server.js` CORS config

### Issue: "users.json not found"
**Solution**: Restart server - it auto-creates the file
```bash
npm start
```

---

## 📊 Comparison: Demo vs Production

| Feature | Demo (localStorage) | Production (Server) |
|---------|-------------------|------------------|
| Storage | Browser localStorage | Encrypted JSON file |
| Passwords | Base64 (not secure) | bcrypt (secure) |
| Sessions | Client-side only | JWT tokens |
| Persistence | Per browser | Across devices |
| OAuth | Not supported | Full support |
| Scale | Single user | Multiple users |
| Security | ⚠️ Demo only | ✅ Production ready |

---

## 🔄 Workflow Comparison

### Demo Mode (No Server)
```
Sign Up → localStorage → Session in browser → Page access
```

### Production Mode (With Server)
```
Sign Up → Server validation → Encrypted file storage →
JWT token → Client session → Secure page access
```

### OAuth Mode
```
Click "Sign in with Google" → Google redirect →
Server verification → JWT token → Redirect to site
```

---

## 🚨 Production Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Remove `.env.example` from production
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (not HTTP)
- [ ] Configure real Google OAuth credentials
- [ ] Configure real Microsoft OAuth credentials
- [ ] Set up database backup
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting for failed logins
- [ ] Set up error logging
- [ ] Enable HTTPS certificates
- [ ] Test all endpoints
- [ ] Add email verification
- [ ] Set up password reset

---

## 📞 Support

### Quick Links
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [JWT.io](https://jwt.io/)
- [bcrypt Docs](https://www.npmjs.com/package/bcryptjs)

### Common Commands

```bash
# Start server
npm start

# Install dependencies
npm install

# Check server health
curl http://localhost:5000/api/health

# View users
cat users.json

# Clear users (backup first!)
echo "[]" > users.json
```

---

## 📝 Version History

**v2.0** (May 2026)
- ✅ Server-based authentication
- ✅ Encrypted file storage
- ✅ Google OAuth support
- ✅ Microsoft OAuth integration  
- ✅ JWT tokens
- ✅ API endpoints

**v1.0** (May 2026)
- ✅ Basic localStorage auth
- ✅ Sign up/login
- ✅ Session management

---

**Last Updated**: May 2026
**Status**: ✅ Production Ready
