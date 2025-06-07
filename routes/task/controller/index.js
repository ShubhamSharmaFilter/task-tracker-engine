import pool from "../../../config/index.js";


export const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      startDate,
      endDate,
      status,
    } = req.query;

    const offset = (page - 1) * limit;
    const values = [];
    let condition = "WHERE 1=1";

    // 🔍 Search (title or description)
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      condition += ` AND (LOWER(title) LIKE $${values.length} OR LOWER(description) LIKE $${values.length})`;
    }

    // 📅 Date filter
    if (startDate) {
      values.push(new Date(new Date(startDate).setHours(0, 0, 0, 0)));
      condition += ` AND created_at >= $${values.length}`;
    }

    if (endDate) {
      values.push(new Date(new Date(endDate).setHours(23, 59, 59, 999)));
      condition += ` AND created_at <= $${values.length}`;
    }

    // 📌 Status filter
    if (status) {
      values.push(status.toLowerCase());
      condition += ` AND LOWER(status) = $${values.length}`;
    }

    // 📄 Paginated query
    const dataQuery = `
      SELECT * FROM tasks
      ${condition}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) FROM tasks
      ${condition}
    `;

    values.push(Number(limit));
    values.push(Number(offset));

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, values),
      pool.query(countQuery, values.slice(0, values.length - 2)), // exclude limit & offset for count
    ]);

    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks: dataResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, status, due_date } = req.body;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, status, due_date]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, status, due_date, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, message: "Task deleted", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
