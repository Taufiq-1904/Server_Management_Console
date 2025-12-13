const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sajikan file static dari root
app.use(express.static(__dirname));

// Route halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// KONFIGURASI DATABASE
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'asset_db', 
    password: 'taufiq', // <--- SESUAIKAN PASSWORDMU
    port: 5432,
});

// --- FUNGSI BANTUAN: CATAT LOG ---
async function createLog(username, activity) {
    try {
        await pool.query(
            'INSERT INTO logs (username, activity) VALUES ($1, $2)',
            [username, activity]
        );
    } catch (err) {
        console.error("Gagal mencatat log:", err);
    }
}

// 1. LOGIN (Sekarang otomatis mencatat Log)
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2', 
            [username, password]
        );
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            
            // ---> INI BAGIAN BARUNYA: Catat ke tabel logs
            await createLog(user.username, `User ${user.username} berhasil login`);
            
            res.json({ user: user });
        } else {
            res.status(401).json({ message: "Login failed" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. USER: Request Loan
app.post('/user/loan', async (req, res) => {
    const { user_id, asset_id } = req.body;
    try {
        // Ambil username buat log (opsional, biar log rapi)
        const userCheck = await pool.query('SELECT username FROM users WHERE id = $1', [user_id]);
        const username = userCheck.rows[0].username;

        const assetCheck = await pool.query('SELECT * FROM assets WHERE asset_id = $1', [asset_id]);
        if (assetCheck.rows.length === 0) return res.status(404).json({message: "Asset not found"});

        await pool.query(
            'INSERT INTO loans (user_id, asset_id, status) VALUES ($1, $2, $3)',
            [user_id, asset_id, 'pending']
        );

        // Catat Log Request
        await createLog(username, `Request pinjam barang: ${asset_id}`);

        res.json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// 3. MANAGER: Approve/Reject
app.post('/manager/loan/approve', async (req, res) => {
    const { loan_id, status } = req.body;
    try {
        await pool.query(
            'UPDATE loans SET status = $1, approval_date = NOW() WHERE id = $2',
            [status, loan_id]
        );
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. MANAGER: History
app.get('/manager/history', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.id, u.username, l.asset_id, l.status, l.request_date 
            FROM loans l
            JOIN users u ON l.user_id = u.id
            ORDER BY l.id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 5. ADMIN: Get Users
app.get('/admin/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, password, role FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 6. ADMIN: Get System Logs (FITUR BARU)
app.get('/admin/logs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});