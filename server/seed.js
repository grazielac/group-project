import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN,
});

(async () => {
  try {
    await db.query("DELETE FROM items");

    await db.query(
      `INSERT INTO items (title, category, link, status) 
      VALUES ('Bake cake', 'Food', 'wwww.instagram.com', 'done')`
    );
    await db.query(
      `INSERT INTO items (title, category, link, status) 
      VALUES ('Visit Viena', 'Travel', NULL, 'pending')`
    );
    console.log("Data seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await db.end();
  }
})();
