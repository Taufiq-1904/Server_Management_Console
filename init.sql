<<<<<<< HEAD
-- Create database for Zitadel
CREATE DATABASE zitadel;

-- Create Zitadel user
CREATE USER zitadel WITH ENCRYPTED PASSWORD 'zitadel123';
GRANT ALL PRIVILEGES ON DATABASE zitadel TO zitadel;

-- Give Zitadel access to its schema after DB creation
ALTER DATABASE zitadel OWNER TO zitadel;


-- NOTE:
-- DO NOT create server_management database manually.
-- Docker already creates POSTGRES_DB = server_management automatically.


-- Everything below runs inside server_management
-- because docker-entrypoint connects to POSTGRES_DB by default.

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    username VARCHAR(255),
    endpoint VARCHAR(255),
    method VARCHAR(10),
    role VARCHAR(50),
    status INTEGER,
    ip_address VARCHAR(50),
    user_agent TEXT
);

CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_role ON activity_logs(role);
CREATE INDEX idx_activity_logs_endpoint ON activity_logs(endpoint);

INSERT INTO activity_logs (user_id, username, endpoint, method, role, status, ip_address, user_agent)
VALUES 
    ('system', 'system', '/health', 'GET', 'system', 200, '127.0.0.1', 'HealthCheck/1.0'),
    ('system', 'system', '/api/auth/login', 'POST', 'anonymous', 200, '127.0.0.1', 'System/1.0');
=======
-- Create database for Zitadel
CREATE DATABASE zitadel;

-- Create Zitadel user
CREATE USER zitadel WITH ENCRYPTED PASSWORD 'zitadel123';
GRANT ALL PRIVILEGES ON DATABASE zitadel TO zitadel;

-- Give Zitadel access to its schema after DB creation
ALTER DATABASE zitadel OWNER TO zitadel;


-- NOTE:
-- DO NOT create server_management database manually.
-- Docker already creates POSTGRES_DB = server_management automatically.


-- Everything below runs inside server_management
-- because docker-entrypoint connects to POSTGRES_DB by default.

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    username VARCHAR(255),
    endpoint VARCHAR(255),
    method VARCHAR(10),
    role VARCHAR(50),
    status INTEGER,
    ip_address VARCHAR(50),
    user_agent TEXT
);

CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_role ON activity_logs(role);
CREATE INDEX idx_activity_logs_endpoint ON activity_logs(endpoint);

INSERT INTO activity_logs (user_id, username, endpoint, method, role, status, ip_address, user_agent)
VALUES 
    ('system', 'system', '/health', 'GET', 'system', 200, '127.0.0.1', 'HealthCheck/1.0'),
    ('system', 'system', '/api/auth/login', 'POST', 'anonymous', 200, '127.0.0.1', 'System/1.0');
>>>>>>> 0297ea5f8ee57a0f9309fdbe4ac3d6f35bbafdbb
