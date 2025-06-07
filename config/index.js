// import pkg from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// export const PORT = process.env.PORT || 5050;

// const { Pool } = pkg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
// });

// export default pool;
// export const secretKey = process.env.JWT_SECRETKEY;


import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5050;

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for most Render SSL setups
  },
});


// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

export default pool;

export const secretKey = process.env.JWT_SECRETKEY;

