# Server_Management_Console
A simple system for managing user access, monitoring servers, and storing activity logs, container-based and centralized login.


## 🏗️ Arsitektur

Sistem ini terdiri dari:
- **Backend**: Node.js + Express dengan JWT authentication
- **Database**: PostgreSQL untuk logs dan data
- **Identity Provider**: Zitadel untuk OAuth2/OIDC
- **Monitoring**: cAdvisor untuk monitoring container
- **Admin Tools**: pgAdmin untuk database management

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (untuk development)
- Port yang tersedia: 3000, 5432, 8080, 8081, 5050

## 🚀 Quick Start

### 1. Clone dan Setup

```bash
# Clone repository
git clone <repository-url>
cd server-management-console

# Copy environment file
cp .env.example .env
```

### 2. Start Semua Services

```bash
docker-compose up -d
```

Tunggu beberapa menit untuk semua service ready.

### 3. Setup Zitadel

#### a. Akses Zitadel Console
Buka: http://localhost:8080

Login dengan kredensial default Zitadel (biasanya admin/admin atau cek log container).

#### b. Buat Project Baru
1. Masuk ke **Projects**
2. Klik **Create New Project**
3. Nama: `ServerManagement`
4. Simpan

#### c. Buat Application
1. Dalam project ServerManagement, klik **Applications**
2. Klik **New**
3. Pilih **API** application type
4. Nama: `ServerManagementAPI`
5. **Authentication Method**: Basic
6. **Grant Types**: Pilih `Password`
7. Simpan dan **copy Client ID dan Client Secret**

#### d. Update .env File
```bash
ZITADEL_CLIENT_ID=<your_client_id>
ZITADEL_CLIENT_SECRET=<your_client_secret>
```

#### e. Restart Backend
```bash
docker-compose restart backend
```

#### f. Buat Users dan Roles

**Buat Roles di Project:**
1. Masuk ke Project → Roles
2. Buat 3 roles:
   - `user` - Basic user access
   - `manager` - Team management access
   - `admin` - Full system access

**Buat Users:**
1. Masuk ke **Users**
2. Buat 3 users:

**User 1 - Basic User:**
- Username: `testuser`
- Email: `user@example.com`
- Password: `Password123!`
- Role: `user`

**User 2 - Manager:**
- Username: `testmanager`
- Email: `manager@example.com`
- Password: `Password123!`
- Role: `manager`

**User 3 - Admin:**
- Username: `testadmin`
- Email: `admin@example.com`
- Password: `Password123!`
- Role: `admin`

**Assign Roles:**
1. Klik setiap user
2. Masuk ke **Authorizations**
3. Pilih Project "ServerManagement"
4. Assign role yang sesuai

## 🧪 Testing API

### 1. Login sebagai User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "user@example.com"
  }
}
```

### 2. Akses User Endpoint

```bash
TOKEN="<access_token_dari_login>"

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Role-Based Access

**User endpoint (semua role bisa akses):**
```bash
curl -X GET http://localhost:3000/api/user \
  -H "Authorization: Bearer $TOKEN"
```

**Manager endpoint (manager & admin saja):**
```bash
curl -X GET http://localhost:3000/api/manager \
  -H "Authorization: Bearer $TOKEN"
```

**Admin endpoint (admin saja):**
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Akses Logs (Admin Only)

```bash
curl -X GET http://localhost:3000/api/logs \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Monitoring & Tools

### cAdvisor (Container Monitoring)
- URL: http://localhost:8081
- Monitoring CPU, RAM, Network, Disk untuk semua container
- Real-time metrics dan graphs

### pgAdmin (Database Management)
- URL: http://localhost:5050
- Email: admin@admin.com
- Password: admin123

**Add Server di pgAdmin:**
1. Right-click Servers → Register → Server
2. Name: ServerManagement
3. Connection tab:
   - Host: postgres
   - Port: 5432
   - Database: server_management
   - Username: admin
   - Password: admin123

### Zitadel Console
- URL: http://localhost:8080
- User management, role assignment, audit logs

## 📁 Struktur Project

```
server-management-console/
├── docker-compose.yml          # Orchestration semua services
├── .env                        # Environment variables
├── init.sql                    # Database initialization
├── logs/                       # Application logs (auto-created)
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── index.js           # Main application
        ├── db/
        │   └── index.js       # Database connection & queries
        ├── middleware/
        │   └── auth.js        # JWT verification & role check
        ├── routes/
        │   ├── auth.js        # Login & user info
        │   ├── user.js        # User endpoint
        │   ├── manager.js     # Manager endpoint
        │   ├── admin.js       # Admin endpoint
        │   └── logs.js        # Logs endpoint
        └── utils/
            └── logger.js      # Winston logger
```

## 🔐 Role-Based Access Control (RBAC)

| Endpoint | User | Manager | Admin |
|----------|------|---------|-------|
| POST /api/auth/login | ✅ | ✅ | ✅ |
| GET /api/auth/me | ✅ | ✅ | ✅ |
| GET /api/user | ✅ | ✅ | ✅ |
| GET /api/manager | ❌ | ✅ | ✅ |
| GET /api/admin | ❌ | ❌ | ✅ |
| GET /api/logs | ❌ | ❌ | ✅ |

## 📝 Logging

### File Logs
Lokasi: `./logs/`

Files:
- `access.log` - HTTP request logs
- `error.log` - Error logs only
- `combined.log` - All logs

### Database Logs
Tabel: `activity_logs`

Columns:
- id, timestamp, user_id, username
- endpoint, method, role, status
- ip_address, user_agent

### Log Format
```json
{
  "timestamp": "2024-12-06 10:30:45",
  "method": "GET",
  "path": "/api/user",
  "status": 200,
  "duration": "45ms",
  "userId": "user_123",
  "role": "user"
}
```

## 🔧 Troubleshooting

### Zitadel tidak bisa akses
```bash
# Check logs
docker logs server_zitadel

# Pastikan postgres sudah ready
docker logs server_postgres
```

### Backend error "Zitadel configuration missing"
```bash
# Pastikan .env sudah diisi
cat .env

# Restart backend
docker-compose restart backend
```

### Token verification failed
```bash
# Pastikan token masih valid (expires in 3600s)
# Login ulang untuk dapat token baru
```

### Port already in use
```bash
# Ganti port di docker-compose.yml
# Atau stop service yang menggunakan port tersebut
```

## 🛠️ Development

### Local Development
```bash
cd backend
npm install
npm run dev
```

### Check Logs
```bash
# Backend logs
docker logs -f server_backend

# Postgres logs
docker logs -f server_postgres

# Zitadel logs
docker logs -f server_zitadel
```

### Reset Everything
```bash
# Stop dan hapus semua
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 📊 Skenario Demo Lengkap

### Scenario 1: User Login & Access
```bash
# 1. Login sebagai user
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password123!"}' \
  | jq -r '.access_token')

# 2. Get user info
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Access user endpoint (SUCCESS)
curl http://localhost:3000/api/user \
  -H "Authorization: Bearer $TOKEN"

# 4. Try manager endpoint (FORBIDDEN)
curl http://localhost:3000/api/manager \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 2: Manager Access
```bash
# 1. Login sebagai manager
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testmanager","password":"Password123!"}' \
  | jq -r '.access_token')

# 2. Access user endpoint (SUCCESS)
curl http://localhost:3000/api/user \
  -H "Authorization: Bearer $TOKEN"

# 3. Access manager endpoint (SUCCESS)
curl http://localhost:3000/api/manager \
  -H "Authorization: Bearer $TOKEN"

# 4. Try admin endpoint (FORBIDDEN)
curl http://localhost:3000/api/admin \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 3: Admin Full Access
```bash
# 1. Login sebagai admin
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"Password123!"}' \
  | jq -r '.access_token')

# 2. Access all endpoints
curl http://localhost:3000/api/user -H "Authorization: Bearer $TOKEN"
curl http://localhost:3000/api/manager -H "Authorization: Bearer $TOKEN"
curl http://localhost:3000/api/admin -H "Authorization: Bearer $TOKEN"

# 3. View activity logs
curl http://localhost:3000/api/logs -H "Authorization: Bearer $TOKEN"

# 4. View log files
curl http://localhost:3000/api/logs/files -H "Authorization: Bearer $TOKEN"
```

### Scenario 4: Monitor Containers
```bash
# Open cAdvisor
open http://localhost:8081

# Check specific container metrics
open http://localhost:8081/docker/server_backend
```

## 🔒 Security Notes

- JWT tokens expire dalam 1 jam (3600 detik)
- Passwords harus menggunakan Zitadel password policy
- Semua endpoints (kecuali /login) memerlukan valid JWT token
- Role checking dilakukan di backend menggunakan middleware
- Activity logs tersimpan untuk audit trail
- Database credentials tidak boleh di-commit ke repository

## 📚 API Documentation

### Authentication

#### POST /api/auth/login
Login dengan username dan password

**Request:**
```json
{
  "username": "testuser",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "user@example.com",
    "name": "Test User"
  }
}
```

#### GET /api/auth/me
Get current user information (requires authentication)

**Response:**
```json
{
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "user@example.com",
    "role": "user",
    "name": "Test User"
  }
}
```

### Protected Endpoints

All endpoints require `Authorization: Bearer <token>` header.

#### GET /api/user
Access: user, manager, admin

Returns user-specific resources and permissions.

#### GET /api/manager
Access: manager, admin

Returns team statistics and management resources.

#### GET /api/admin
Access: admin only

Returns system-wide statistics and admin resources.

#### GET /api/logs
Access: admin only

Returns activity logs from database.

Query params:
- `limit` (default: 100)
- `offset` (default: 0)

## 🎯 Next Steps

1. ✅ Setup Zitadel dengan OAuth2 Password Flow
2. ✅ Buat users dengan different roles
3. ✅ Test RBAC untuk setiap role
4. ✅ Monitor containers di cAdvisor
5. ✅ Check activity logs di database dan files
6. 📝 Customize untuk kebutuhan spesifik perusahaan

## 📞 Support

Jika ada masalah:
1. Check Docker logs: `docker-compose logs -f`
2. Verify Zitadel setup di console
3. Pastikan semua environment variables sudah diisi
4. Check port conflicts

---

**Built with ❤️ using Docker, Node.js, Zitadel, and PostgreSQL**
