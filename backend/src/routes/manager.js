const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const { pool } = require('../db');

const router = express.Router();

// Manager endpoint - accessible by manager and admin only
router.get('/', verifyToken, requireRole('manager', 'admin'), async (req, res) => {
  try {
    // Get team statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT user_id) as total_users,
        COUNT(*) as total_activities,
        COUNT(DISTINCT DATE(timestamp)) as active_days
      FROM activity_logs
      WHERE timestamp > NOW() - INTERVAL '30 days'
    `);
    
    const recentActivity = await pool.query(`
      SELECT user_id, username, endpoint, method, timestamp
      FROM activity_logs
      ORDER BY timestamp DESC
      LIMIT 10
    `);
    
    res.json({
      message: 'Manager endpoint accessed successfully',
      data: {
        manager: {
          id: req.user.sub,
          username: req.user.username,
          role: req.user.role
        },
        statistics: statsResult.rows[0],
        recentActivity: recentActivity.rows,
        resources: [
          { id: 1, name: 'Team Dashboard', type: 'dashboard' },
          { id: 2, name: 'Team Reports', type: 'reports' },
          { id: 3, name: 'User Management', type: 'management' }
        ],
        permissions: [
          'view_team_data',
          'view_team_reports',
          'manage_team_members',
          'view_team_activity'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch manager data' });
  }
});

module.exports = router;