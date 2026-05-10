import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "class_notes",
  password: "1234",
  port: 5432,
});

export default pool;