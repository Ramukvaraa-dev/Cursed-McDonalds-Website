/**
 * Server for Cursed McDonald's Authentication
 * Handles OAuth, encrypted account storage, and API endpoints
 * 
 * Install dependencies: npm install express dotenv bcryptjs jsonwebtoken cors body-parser
 * Run: node server.js
 * Server runs on http://localhost:5000
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'file://'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../cursedmcdonalds')));

/**
 * Initialize users file if it doesn't exist
 */
const initializeUsersFile = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
};

/**
 * Read users from encrypted file
 */
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

/**
 * Write users to encrypted file
 */
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

/**
 * Find user by email
 */
const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email === email);
};

/**
 * Find user by username
 */
const findUserByUsername = (username) => {
  const users = readUsers();
  return users.find(u => u.username === username);
};

/**
 * POST /api/auth/signup
 * Create new user account
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be 3+ characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be 6+ characters' });
    }

    // Check for duplicates
    if (findUserByEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    if (findUserByUsername(username)) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Hash password with bcrypt (secure)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      provider: 'local',
      createdAt: new Date().toISOString()
    };

    // Save to file
    const users = readUsers();
    users.push(newUser);
    writeUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        username,
        email,
        provider: 'local'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords with bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/google
 * Google OAuth callback
 */
app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ success: false, message: 'Invalid Google data' });
    }

    let user = findUserByEmail(email);

    if (!user) {
      // Create new user from Google
      const newUser = {
        id: Date.now().toString(),
        username: name || email.split('@')[0],
        email,
        googleId,
        picture,
        provider: 'google',
        createdAt: new Date().toISOString()
      };

      const users = readUsers();
      users.push(newUser);
      writeUsers(users);
      user = newUser;
    } else if (!user.googleId) {
      // Link Google to existing account
      const users = readUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex].googleId = googleId;
      users[userIndex].picture = picture;
      writeUsers(users);
      user = users[userIndex];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: 'google'
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/microsoft
 * Microsoft OAuth callback
 */
app.post('/api/auth/microsoft', async (req, res) => {
  try {
    const { microsoftId, email, name, picture } = req.body;

    if (!microsoftId || !email) {
      return res.status(400).json({ success: false, message: 'Invalid Microsoft data' });
    }

    let user = findUserByEmail(email);

    if (!user) {
      // Create new user from Microsoft
      const newUser = {
        id: Date.now().toString(),
        username: name || email.split('@')[0],
        email,
        microsoftId,
        picture,
        provider: 'microsoft',
        createdAt: new Date().toISOString()
      };

      const users = readUsers();
      users.push(newUser);
      writeUsers(users);
      user = newUser;
    } else if (!user.microsoftId) {
      // Link Microsoft to existing account
      const users = readUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex].microsoftId = microsoftId;
      users[userIndex].picture = picture;
      writeUsers(users);
      user = users[userIndex];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Microsoft login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: 'microsoft'
      }
    });
  } catch (error) {
    console.error('Microsoft auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
app.post('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', users: readUsers().length });
});

// Initialize and start server
initializeUsersFile();

app.listen(PORT, () => {
  console.log(`\n🔐 Cursed McDonald's Auth Server`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`📁 Users file: ${USERS_FILE}`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET ? 'Set' : 'Using default (not secure!)'}\n`);
});
