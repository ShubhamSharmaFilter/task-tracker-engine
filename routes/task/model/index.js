// CREATE TABLE IF NOT EXISTS tasks (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   status VARCHAR(50) DEFAULT 'pending',
//   due_date TIMESTAMP,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
