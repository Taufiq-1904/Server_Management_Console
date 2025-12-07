<<<<<<< HEAD
const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
const CLIENT_ID = process.env.ZITADEL_CLIENT_ID;
const CLIENT_SECRET = process.env.ZITADEL_CLIENT_SECRET;

// Login endpoint - OAuth2 Password Flow
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required' 
      });
    }
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Zitadel configuration missing. Please set ZITADEL_CLIENT_ID and ZITADEL_CLIENT_SECRET' 
      });
    }
    
    // Request token dari Zitadel menggunakan Password Flow
    const tokenResponse = await axios.post(
      `${ZITADEL_ISSUER}/oauth/v2/token`,
      new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        }
      }
    );
    
    const { access_token, refresh_token, expires_in, token_type } = tokenResponse.data;
    
    // Ambil user info
    const userInfoResponse = await axios.get(
      `${ZITADEL_ISSUER}/oidc/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    const userInfo = userInfoResponse.data;
    
    logger.info('User logged in', {
      userId: userInfo.sub,
      username: username
    });
    
    res.json({
      success: true,
      access_token,
      refresh_token,
      expires_in,
      token_type,
      user: {
        id: userInfo.sub,
        username: userInfo.preferred_username || username,
        email: userInfo.email,
        name: userInfo.name
      }
    });
    
  } catch (error) {
    logger.error('Login failed', {
      error: error.message,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    res.status(500).json({ 
      error: 'Login failed',
      details: error.response?.data || error.message
    });
  }
});

// Get current user info
router.get('/me', verifyToken, async (req, res) => {
  res.json({
    user: {
      id: req.user.sub,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name
    }
  });
});

=======
const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
const CLIENT_ID = process.env.ZITADEL_CLIENT_ID;
const CLIENT_SECRET = process.env.ZITADEL_CLIENT_SECRET;

// Login endpoint - OAuth2 Password Flow
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required' 
      });
    }
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Zitadel configuration missing. Please set ZITADEL_CLIENT_ID and ZITADEL_CLIENT_SECRET' 
      });
    }
    
    // Request token dari Zitadel menggunakan Password Flow
    const tokenResponse = await axios.post(
      `${ZITADEL_ISSUER}/oauth/v2/token`,
      new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        }
      }
    );
    
    const { access_token, refresh_token, expires_in, token_type } = tokenResponse.data;
    
    // Ambil user info
    const userInfoResponse = await axios.get(
      `${ZITADEL_ISSUER}/oidc/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    const userInfo = userInfoResponse.data;
    
    logger.info('User logged in', {
      userId: userInfo.sub,
      username: username
    });
    
    res.json({
      success: true,
      access_token,
      refresh_token,
      expires_in,
      token_type,
      user: {
        id: userInfo.sub,
        username: userInfo.preferred_username || username,
        email: userInfo.email,
        name: userInfo.name
      }
    });
    
  } catch (error) {
    logger.error('Login failed', {
      error: error.message,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    res.status(500).json({ 
      error: 'Login failed',
      details: error.response?.data || error.message
    });
  }
});

// Get current user info
router.get('/me', verifyToken, async (req, res) => {
  res.json({
    user: {
      id: req.user.sub,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name
    }
  });
});

>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
module.exports = router;