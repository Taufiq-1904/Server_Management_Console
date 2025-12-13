-- Create database for Zitadel
CREATE DATABASE zitadel;

-- Create Zitadel user
CREATE USER zitadel WITH ENCRYPTED PASSWORD 'zitadel123';
GRANT ALL PRIVILEGES ON DATABASE zitadel TO zitadel;

ALTER DATABASE zitadel OWNER TO zitadel;


-- Create database for backend API
CREATE DATABASE server_management;

-- Switch to server_management DB
\c server_management;

-- Create table for logging
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
