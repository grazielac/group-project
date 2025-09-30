
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DB_CONN,
});

app.get("/api/items", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM items ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));