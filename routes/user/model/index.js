// CREATE EXTENSION IF NOT EXISTS "pgcrypto";

// CREATE TABLE IF NOT EXISTS users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   first_name VARCHAR(100) NOT NULL,
//   last_name VARCHAR(100),
//   email VARCHAR(255) UNIQUE NOT NULL,
//   phone VARCHAR(20),
//   password TEXT NOT NULL,
//   user_type VARCHAR(50) DEFAULT 'user',
//   role VARCHAR(50),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
