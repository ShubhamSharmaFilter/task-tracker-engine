import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../../../config/index.js";
import { generateToken } from "../../../middlewares/auth.js";


export const createUser = async (req, res) => {
  const { firstName, lastName, email, phone, password, userType, role } =
    req.body;

  // ✅ Optional: Ensure table exists (use only during dev, move to migrations later)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password TEXT NOT NULL,
      user_type VARCHAR(50) DEFAULT 'user',
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    // ✅ Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ✅ Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    const result = await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, phone, password, user_type, role) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, first_name, last_name, email, user_type, role`,
      [firstName, lastName, email, phone, hashedPassword, userType, role]
    );

    const user = result.rows[0];

    // ✅ Generate token
    const token = generateToken(user.id, user.email);

    // ✅ Success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }


    const token = generateToken({id: user.id, email: user.email })

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Verify Token
export const verifyUserToken = async (req, res) => {
  try {
    const userData = req.user; // from middleware
    console.log("userData",userData);

    if (!userData || !userData.email) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const result = await pool.query(
      "SELECT id, first_name, last_name, email, phone, user_type, role FROM users WHERE email = $1",
      [userData.email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Token verified successfully",
      user,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// // Get User by ID
// export const getUserById = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const result = await pool.query(
//       "SELECT id, first_name, last_name, email, user_type, role FROM users WHERE id = $1",
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User fetched successfully",
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Get user by ID error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };
// ✅ Get User by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, phone, user_type, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
