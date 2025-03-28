const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

test("Debe conectarse a MySQL", async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  expect(connection).toBeDefined();
  await connection.end();
});