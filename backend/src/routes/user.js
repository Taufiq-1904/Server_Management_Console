<<<<<<< HEAD
const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// User endpoint - accessible by user, manager, admin
router.get('/', verifyToken, requireRole('user', 'manager', 'admin'), (req, res) => {
  res.json({
    message: 'User endpoint accessed successfully',
    data: {
      user: {
        id: req.user.sub,
        username: req.user.username,
        role: req.user.role
      },
      resources: [
        { id: 1, name: 'User Dashboard', type: 'dashboard' },
        { id: 2, name: 'Profile Settings', type: 'settings' },
        { id: 3, name: 'Activity History', type: 'history' }
      ],
      permissions: [
        'view_own_profile',
        'update_own_profile',
        'view_own_activity'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

=======
const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// User endpoint - accessible by user, manager, admin
router.get('/', verifyToken, requireRole('user', 'manager', 'admin'), (req, res) => {
  res.json({
    message: 'User endpoint accessed successfully',
    data: {
      user: {
        id: req.user.sub,
        username: req.user.username,
        role: req.user.role
      },
      resources: [
        { id: 1, name: 'User Dashboard', type: 'dashboard' },
        { id: 2, name: 'Profile Settings', type: 'settings' },
        { id: 3, name: 'Activity History', type: 'history' }
      ],
      permissions: [
        'view_own_profile',
        'update_own_profile',
        'view_own_activity'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
module.exports = router;