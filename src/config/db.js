const mysql = require("mysql2/promise");
const { db } = require("./env");
const pool = mysql.createPool(db);
async function tx(cb) {
  const con = await pool.getConnection();
  try {
    await con.beginTransaction();
    const result = await cb(con);
    await con.commit();
    return result;
  } catch (e) {
    await con.rollback();
    throw e;
  } finally {
    con.release();
  }
}
module.exports = { pool, tx };
