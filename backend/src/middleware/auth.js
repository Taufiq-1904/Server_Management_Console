<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const logger = require('../utils/logger');
const { logActivity } = require('../db');

const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';

// JWKS client untuk verifikasi token
const client = jwksClient({
  jwksUri: `${ZITADEL_ISSUER}/.well-known/openid-configuration`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Middleware untuk verifikasi JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Decode tanpa verifikasi dulu untuk mendapatkan info
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Verifikasi token
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      issuer: ZITADEL_ISSUER
    }, async (err, verified) => {
      if (err) {
        logger.error('Token verification failed', { error: err.message });
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Ambil role dari token atau dari Zitadel
      let role = 'user';
      
      // Cek di claims token
      if (verified['urn:zitadel:iam:org:project:roles']) {
        const roles = verified['urn:zitadel:iam:org:project:roles'];
        if (roles.admin) role = 'admin';
        else if (roles.manager) role = 'manager';
      }
      
      req.user = {
        ...verified,
        role: role,
        username: verified.preferred_username || verified.email || verified.sub
      };
      
      // Log aktivitas
      await logActivity({
        userId: req.user.sub,
        username: req.user.username,
        endpoint: req.path,
        method: req.method,
        role: req.user.role,
        status: 200,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      next();
    });
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware untuk cek role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Access denied', {
        userId: req.user.sub,
        role: req.user.role,
        requiredRoles: allowedRoles,
        endpoint: req.path
      });
      
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Required role: ${allowedRoles.join(' or ')}`,
        yourRole: req.user.role
      });
    }
    
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
=======
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const logger = require('../utils/logger');
const { logActivity } = require('../db');

const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';

// JWKS client untuk verifikasi token
const client = jwksClient({
  jwksUri: `${ZITADEL_ISSUER}/.well-known/openid-configuration`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Middleware untuk verifikasi JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Decode tanpa verifikasi dulu untuk mendapatkan info
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Verifikasi token
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      issuer: ZITADEL_ISSUER
    }, async (err, verified) => {
      if (err) {
        logger.error('Token verification failed', { error: err.message });
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Ambil role dari token atau dari Zitadel
      let role = 'user';
      
      // Cek di claims token
      if (verified['urn:zitadel:iam:org:project:roles']) {
        const roles = verified['urn:zitadel:iam:org:project:roles'];
        if (roles.admin) role = 'admin';
        else if (roles.manager) role = 'manager';
      }
      
      req.user = {
        ...verified,
        role: role,
        username: verified.preferred_username || verified.email || verified.sub
      };
      
      // Log aktivitas
      await logActivity({
        userId: req.user.sub,
        username: req.user.username,
        endpoint: req.path,
        method: req.method,
        role: req.user.role,
        status: 200,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      next();
    });
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware untuk cek role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Access denied', {
        userId: req.user.sub,
        role: req.user.role,
        requiredRoles: allowedRoles,
        endpoint: req.path
      });
      
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Required role: ${allowedRoles.join(' or ')}`,
        yourRole: req.user.role
      });
    }
    
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
};