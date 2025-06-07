import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";
import pool from "./config/index.js";

dotenv.config();

const app = express();
app.use(cors('*'));
app.use(express.json());

// Routes placeholder
app.use("/api", mainRouter);

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
