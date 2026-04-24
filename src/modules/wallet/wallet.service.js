const { tx, pool } = require("../../config/db");
const AppError = require("../../utils/AppError");
const walletRepo = require("./wallet.repository");
const userRepo = require("../users/user.repository");
async function allocateCoins(actor, { to_user_id, amount, remarks }) {
  amount = Number(amount);
  if (!amount || amount <= 0)
    throw new AppError("Amount must be greater than 0");
  return tx(async (con) => {
    const from = await userRepo.findById(actor.id, con);
    const to = await userRepo.findById(to_user_id, con);
    if (!to) throw new AppError("Receiver not found");
    if (to.parent_id !== actor.id && actor.role_key !== "SUPER_ADMIN")
      throw new AppError(
        "You can allocate coins only to your child users",
        403,
      );
    const fromWallet = await walletRepo.getWalletForUpdate(actor.id, con);
    const toWallet = await walletRepo.getWalletForUpdate(to_user_id, con);
    if (Number(fromWallet.balance) < amount)
      throw new AppError("Insufficient balance");
    const group = `ALLOC-${Date.now()}-${actor.id}-${to_user_id}`;
    const fromBefore = Number(fromWallet.balance),
      toBefore = Number(toWallet.balance);
    await walletRepo.updateBalance(actor.id, fromBefore - amount, con);
    await walletRepo.updateBalance(to_user_id, toBefore + amount, con);
    await walletRepo.insertTxn(
      {
        user_id: actor.id,
        from_user_id: actor.id,
        to_user_id,
        txn_group_id: group,
        txn_type: "COIN_ALLOCATION_DEBIT",
        debit: amount,
        balance_before: fromBefore,
        balance_after: fromBefore - amount,
        remarks: remarks || `Allocated to ${to.username}`,
        created_by: actor.id,
      },
      con,
    );
    await walletRepo.insertTxn(
      {
        user_id: to_user_id,
        from_user_id: actor.id,
        to_user_id,
        txn_group_id: group,
        txn_type: "COIN_ALLOCATION_CREDIT",
        credit: amount,
        balance_before: toBefore,
        balance_after: toBefore + amount,
        remarks: remarks || `Received from ${from.username}`,
        created_by: actor.id,
      },
      con,
    );
    await con.query(
      "INSERT INTO audit_logs(actor_user_id,action,entity_name,entity_id,details) VALUES(?,?,?,?,?)",
      [
        actor.id,
        "ALLOCATE_COINS",
        "wallet_transactions",
        group,
        JSON.stringify({ to_user_id, amount }),
      ],
    );
    return {
      txn_group_id: group,
      from_balance: fromBefore - amount,
      to_balance: toBefore + amount,
    };
  });
}
async function myBalance(actor) {
  const [rows] = await pool.query(
    "SELECT balance FROM wallets WHERE user_id=?",
    [actor.id],
  );
  return rows[0] || { balance: 0 };
}
async function transactions(actor, userId) {
  return walletRepo.listTxns(userId || actor.id, pool);
}
module.exports = { allocateCoins, myBalance, transactions };
