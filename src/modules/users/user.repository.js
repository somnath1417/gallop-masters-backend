const { pool } = require("../../config/db");
const baseSelect = `SELECT u.id,u.name,u.username,u.mobile,u.status,u.parent_id,u.created_at,r.role_key,r.role_name,w.balance FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN wallets w ON w.user_id=u.id`;
async function findByUsername(username) {
  const [rows] = await pool.query(`${baseSelect} WHERE u.username=? LIMIT 1`, [
    username,
  ]);
  return rows[0] || null;
}
async function findById(id, con = pool) {
  const [rows] = await con.query(`${baseSelect} WHERE u.id=? LIMIT 1`, [id]);
  return rows[0] || null;
}
async function getRoleByKey(roleKey, con = pool) {
  const [rows] = await con.query("SELECT * FROM roles WHERE role_key=?", [
    roleKey,
  ]);
  return rows[0] || null;
}
async function createUser(data, con) {
  const [r] = await con.query(
    "INSERT INTO users(role_id,parent_id,name,username,mobile,password_hash,status,created_by) VALUES(?,?,?,?,?,?,?,?)",
    [
      data.role_id,
      data.parent_id,
      data.name,
      data.username,
      data.mobile || null,
      data.password_hash,
      "ACTIVE",
      data.created_by,
    ],
  );
  return r.insertId;
}
async function createWallet(userId, balance, con) {
  await con.query("INSERT INTO wallets(user_id,balance) VALUES(?,?)", [
    userId,
    balance || 0,
  ]);
}
// async function listByScope(rootUserId, con = pool) {
//   const [rows] = await con.query(
//     `WITH RECURSIVE tree AS (SELECT u.id FROM users u WHERE u.id=? UNION ALL SELECT c.id FROM users c INNER JOIN tree t ON c.parent_id=t.id) ${baseSelect} WHERE u.id IN (SELECT id FROM tree) ORDER BY r.level_no,u.id`,
//     [rootUserId],
//   );
//   console.log("rows==========>", rows);

//   return rows;
// }
async function listByScope(rootUserId, con = pool) {
  const [rows] = await con.query(
    `${baseSelect}
     WHERE u.parent_id = ?
     ORDER BY r.level_no, u.id`,
    [rootUserId],
  );

  return rows;
}

async function listDirectChildren(parentId, con = pool) {
  const [rows] = await con.query(
    `${baseSelect} WHERE u.parent_id=? ORDER BY u.id DESC`,
    [parentId],
  );
  return rows;
}
module.exports = {
  findByUsername,
  findById,
  getRoleByKey,
  createUser,
  createWallet,
  listByScope,
  listDirectChildren,
};
