async function getWalletForUpdate(userId, con) {
  const [rows] = await con.query(
    "SELECT * FROM wallets WHERE user_id=? FOR UPDATE",
    [userId],
  );
  return rows[0] || null;
}
async function updateBalance(userId, balance, con) {
  await con.query("UPDATE wallets SET balance=? WHERE user_id=?", [
    balance,
    userId,
  ]);
}
async function insertTxn(data, con) {
  const [r] = await con.query(
    `INSERT INTO wallet_transactions(user_id,from_user_id,to_user_id,txn_group_id,txn_type,debit,credit,balance_before,balance_after,remarks,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [
      data.user_id,
      data.from_user_id || null,
      data.to_user_id || null,
      data.txn_group_id,
      data.txn_type,
      data.debit || 0,
      data.credit || 0,
      data.balance_before,
      data.balance_after,
      data.remarks || null,
      data.created_by || null,
    ],
  );
  return r.insertId;
}
async function listTxns(userId, con) {
  const [rows] = await con.query(
    "SELECT * FROM wallet_transactions WHERE user_id=? ORDER BY id DESC LIMIT 100",
    [userId],
  );
  return rows;
}
module.exports = { getWalletForUpdate, updateBalance, insertTxn, listTxns };
