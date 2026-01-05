-- Admin Panel: Add users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin user (username: admin, password: admin123)
-- Password hash generated with bcrypt
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@justicialegalminds.com', '$2b$10$Ktljyh7g3uHmiBAlnC', 'admin')
ON DUPLICATE KEY UPDATE username=username;
