
let wallets = {};

function allocateCoins(parentId, childId, amount) {
  if (!wallets[parentId] || wallets[parentId] < amount) {
    throw new Error("Insufficient balance");
  }

  wallets[parentId] -= amount;
  wallets[childId] = (wallets[childId] || 0) + amount;

  return { parentBalance: wallets[parentId], childBalance: wallets[childId] };
}

function setInitialBalance(userId, amount) {
  wallets[userId] = amount;
}

module.exports = { allocateCoins, setInitialBalance };
