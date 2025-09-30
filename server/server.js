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

// POST a new item
app.post("/api/items", async (req, res) => {
  try {
    const { title, category, link, status } = req.body;

    await db.query(
      "INSERT INTO items (title, category, link, status) VALUES ($1, $2, $3, $4)",
      [title, category, link, status]
    );

    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("❌ Error adding item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// PUT (update) an item by ID
app.put("/api/items/id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, link, status } = req.body;

    await db.query(
      "UPDATE items SET title = $1, category = $2, link = $3, status = $4 WHERE id = $5",
      [title, category, link, status, id]
    );

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE an item by ID
app.delete("/api/items/id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM items WHERE id = $1", [id]);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
