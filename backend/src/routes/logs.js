const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken, requireRole } = require('../middleware/auth');
const { getActivityLogs } = require('../db');

const router = express.Router();

// Get activity logs from database - Admin only
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const logs = await getActivityLogs(limit, offset);
    
    res.json({
      success: true,
      data: logs,
      pagination: {
        limit,
        offset,
        count: logs.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch logs',
      details: error.message
    });
  }
});

// Get file logs - Admin only
router.get('/files', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const logsDir = path.join(__dirname, '../../logs');
    const files = fs.readdirSync(logsDir);
    
    const logFiles = files.map(file => {
      const stats = fs.statSync(path.join(logsDir, file));
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime,
        path: `/api/logs/files/${file}`
      };
    });
    
    res.json({
      success: true,
      files: logFiles
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to list log files',
      details: error.message
    });
  }
});

// Download specific log file - Admin only
router.get('/files/:filename', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const filename = req.params.filename;
    const logsDir = path.join(__dirname, '../../logs');
    const filePath = path.join(logsDir, filename);
    
    // Security check
    if (!filePath.startsWith(logsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const lines = req.query.lines ? parseInt(req.query.lines) : null;
    
    if (lines) {
      // Read last N lines
      const content = fs.readFileSync(filePath, 'utf8');
      const allLines = content.split('\n').filter(line => line.trim());
      const lastLines = allLines.slice(-lines);
      
      res.json({
        success: true,
        filename,
        lines: lastLines
      });
    } else {
      // Download full file
      res.download(filePath);
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to read log file',
      details: error.message
    });
  }
});

module.exports = router;