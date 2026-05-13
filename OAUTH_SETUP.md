# 🔐 OAuth Setup Guide

Complete step-by-step guide for setting up Google and Microsoft OAuth for Cursed McDonald's.

## 🔵 Google Sign-In Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a Project" → "NEW PROJECT"
4. Name: "Cursed McDonald's"
5. Click "CREATE"

### Step 2: Enable Google+ API

1. In the left sidebar, click "APIs & Services"
2. Click "ENABLED APIS & SERVICES"
3. Click "+ ENABLE APIS AND SERVICES"
4. Search for "Google+ API"
5. Click on it
6. Click "ENABLE"

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials" (left sidebar)
2. Click "+ CREATE CREDENTIALS"
3. Choose "OAuth client ID"
4. If prompted, click "CONFIGURE CONSENT SCREEN" first:
   - User Type: "External"
   - Click "CREATE"
   - Fill in app name: "Cursed McDonald's"
   - Add your email
   - Skip optional info
   - Click "SAVE AND CONTINUE"
   - Skip scopes (default is fine)
   - Skip test users
   - Click "SAVE AND CONTINUE"
5. Back to credentials, click "CREATE CREDENTIALS" again
6. Choose "OAuth client ID"
7. Application type: "Web application"
8. Name: "Cursed McDonald's Web App"
9. Under "Authorized JavaScript origins", click "ADD URI":
   - Add: `http://localhost:5000`
   - Add: `http://localhost:3000`
   - Add: `http://127.0.0.1:5000`
10. Under "Authorized redirect URIs", click "ADD URI":
    - Add: `http://localhost:5000/auth/callback`
    - Add: `http://localhost:3000/auth/callback`
11. Click "CREATE"
12. **Copy the Client ID** (you'll need it)

### Step 4: Add to Login Page

Edit `cursedmcdonalds/login.html`:

```javascript
// Find this line around line 270:
client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'

// Replace with your actual Client ID:
client_id: '123456789-abcdefg.apps.googleusercontent.com'
```

### Step 5: Test Google Sign-In

1. Start the server: `npm start`
2. Go to `http://localhost:5000`
3. Click "Sign in with Google"
4. Sign in with your Google account
5. ✅ You should be logged in!

---

## 🔷 Microsoft OAuth Setup

### Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. Click "Azure Active Directory" in left sidebar

### Step 2: Register New Application

1. Click "App registrations" (left sidebar)
2. Click "+ New registration"
3. Name: "Cursed McDonald's Auth"
4. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI:
   - Platform: "Web"
   - URI: `http://localhost:5000/auth/callback`
6. Click "REGISTER"

### Step 3: Get Credentials

1. On the app page, copy "Application (client) ID"
2. Under "Certificates & secrets":
   - Click "+ New client secret"
   - Description: "Production secret"
   - Expires: "24 months"
   - Click "Add"
   - **Copy the secret value** (only shown once!)

### Step 4: Add to .env

Edit `.env`:

```env
MICROSOFT_CLIENT_ID=your_client_id_from_azure
MICROSOFT_CLIENT_SECRET=your_client_secret_from_azure
MICROSOFT_TENANT_ID=common
```

### Step 5: Configure Permissions

1. In Azure, click "API permissions" (left sidebar)
2. Click "+ Add a permission"
3. Click "Microsoft Graph"
4. Choose "Delegated permissions"
5. Search and select:
   - `user.read`
   - `email`
   - `profile`
6. Click "Add permissions"

### Step 6: Test Microsoft Sign-In

1. Start server: `npm start`
2. Go to `http://localhost:5000`
3. Click Microsoft icon
4. Sign in with Microsoft account
5. ✅ You should be logged in!

---

## 🔐 Environment Variables Reference

### .env File Setup

```env
# REQUIRED
JWT_SECRET=your-super-secret-key-minimum-32-chars

# GOOGLE (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret_here

# MICROSOFT (Optional - for Microsoft Sign-In)
MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789012
MICROSOFT_CLIENT_SECRET=your_microsoft_secret_here
MICROSOFT_TENANT_ID=common
```

### Generate Random JWT Secret

```bash
# macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Production Deployment

### For Heroku/AWS/DigitalOcean

1. Update OAuth redirect URIs to your domain:
   - Google: `https://yoursite.com/auth/callback`
   - Microsoft: `https://yoursite.com/auth/callback`

2. Update .env variables:
   ```env
   API_BASE_URL=https://yoursite.com
   FRONTEND_URL=https://yoursite.com
   NODE_ENV=production
   ```

3. Set strong `JWT_SECRET`

### HTTPS Requirement

OAuth requires HTTPS in production. Use:
- Let's Encrypt (free)
- Cloudflare (free SSL)
- AWS Certificate Manager
- Your hosting provider's SSL

---

## 🧪 Testing OAuth Flows

### Test Google Sign-In

```bash
# 1. Make sure server is running
npm start

# 2. Open browser
http://localhost:5000

# 3. Click "Sign in with Google"

# 4. Sign in with test Google account

# 5. Check if redirected to home page and logged in
```

### Test Microsoft Sign-In

```bash
# 1. Make sure server is running
npm start

# 2. Open browser
http://localhost:5000

# 3. Click Microsoft icon

# 4. Sign in with test Microsoft account

# 5. Check if redirected to home page and logged in
```

### Test API Endpoints

```bash
# Test Google signup
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "test_google_id",
    "email": "test@gmail.com",
    "name": "Test User",
    "picture": "https://example.com/pic.jpg"
  }'

# Test Microsoft signup
curl -X POST http://localhost:5000/api/auth/microsoft \
  -H "Content-Type: application/json" \
  -d '{
    "microsoftId": "test_microsoft_id",
    "email": "test@outlook.com",
    "name": "Test User"
  }'
```

---

## ❌ Troubleshooting

### Google Sign-In Not Working

**Problem**: "Sign in with Google" button doesn't work
- Check Client ID is correct in `login.html`
- Verify redirect URIs are added in Google Cloud Console
- Check browser console (F12) for errors
- Make sure HTTPS in production

**Solution**:
```javascript
// In browser console, check for errors:
console.error() // Look for OAuth errors
```

### Microsoft Sign-In Not Working

**Problem**: "Sign in with Microsoft" shows error
- Check MICROSOFT_CLIENT_ID in .env
- Check MICROSOFT_CLIENT_SECRET in .env
- Verify redirect URI in Azure
- Check API permissions are configured

**Solution**:
1. Check .env has correct credentials
2. Restart server: `npm start`
3. Check Azure portal for app status
4. Verify permissions are granted

### CORS Error

**Problem**: "CORS policy blocked..."
- OAuth redirects are being blocked by server CORS
- Check CORS configuration in `server.js`

**Solution**:
Edit `server.js` line ~15:
```javascript
origin: ['http://localhost:3000', 'http://localhost:5000', 'your-domain.com']
```

### JWT Secret Not Set

**Problem**: "Authentication failed"
- JWT_SECRET not set or changed

**Solution**:
```bash
# Check .env has JWT_SECRET
cat .env | grep JWT_SECRET

# If missing, generate and add:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 Testing on Mobile

### Google OAuth on Mobile

1. Google Sign-In works on mobile automatically
2. Just click the button and sign in
3. Works on iOS and Android

### Microsoft OAuth on Mobile

1. Set up MSAL for mobile in `login.html`
2. Test on physical device
3. Make sure domain is in allowed URIs

---

## 🔐 Security Best Practices

### During Development
- ✅ Use `http://localhost:5000`
- ✅ Store secrets in `.env` (never commit)
- ✅ Use test OAuth apps
- ✅ Regenerate secrets if leaked

### In Production
- ✅ Use HTTPS only
- ✅ Use strong JWT_SECRET (32+ chars)
- ✅ Regenerate OAuth secrets regularly
- ✅ Use environment variables (not hardcoded)
- ✅ Enable 2FA on OAuth app accounts
- ✅ Monitor failed login attempts
- ✅ Set up rate limiting

---

## 📞 Support Links

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Microsoft OAuth Docs**: https://learn.microsoft.com/en-us/azure/active-directory/develop/
- **Google Cloud Console**: https://console.cloud.google.com/
- **Azure Portal**: https://portal.azure.com/
- **JWT.io**: https://jwt.io/ (decode tokens)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google Client ID added to `login.html`
- [ ] Microsoft credentials in `.env`
- [ ] JWT_SECRET set in `.env`
- [ ] Server starts without errors: `npm start`
- [ ] Login page loads: `http://localhost:5000`
- [ ] Can create account with email/password
- [ ] Can log in
- [ ] Google Sign-In button appears
- [ ] Microsoft Sign-In button appears
- [ ] Google Sign-In works (if configured)
- [ ] Microsoft Sign-In works (if configured)
- [ ] Can view protected pages after login
- [ ] Can log out

---

**Version**: 2.0  
**Last Updated**: May 2026  
**Status**: ✅ Complete
