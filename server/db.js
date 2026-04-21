const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id            VARCHAR(50)  PRIMARY KEY,
        title         VARCHAR(255) NOT NULL,
        category      VARCHAR(100) DEFAULT 'Education',
        location      VARCHAR(255) DEFAULT '',
        beneficiaries VARCHAR(255) DEFAULT '',
        year          VARCHAR(50)  DEFAULT '',
        partner       VARCHAR(255) DEFAULT '',
        status        VARCHAR(50)  DEFAULT 'ongoing',
        description   TEXT         DEFAULT '',
        impact        TEXT         DEFAULT '',
        sort_order    INTEGER      DEFAULT 0,
        created_at    TIMESTAMPTZ  DEFAULT NOW(),
        updated_at    TIMESTAMPTZ  DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS photos (
        id           SERIAL      PRIMARY KEY,
        project_id   VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        url          TEXT        NOT NULL,
        caption      VARCHAR(255) DEFAULT '',
        sort_order   INTEGER     DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_photos_project ON photos(project_id);
    `);
    console.log("✅ Database schema ready");
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
