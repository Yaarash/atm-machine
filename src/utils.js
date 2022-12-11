
function sendResponse(res, statusCode = 200, message = '') {
  return res.status(statusCode)
    .send({ message});
}

function isValidWithdrawal(withdrawalAmount, maxAmount) {
  return withdrawalAmount <= maxAmount;
}

function calculateResult(withdrawalAmount, withdrawalCurrency, inventory) {
  let remain = withdrawalAmount;
  const usedBillsAndCoins = {
    "bills": [],
    "coins": []
  }
  const usedBills = {};
  const usedCoins = {};
  if (!inventory[withdrawalCurrency]) {
    return usedBillsAndCoins;
  }
  const currencyMap = inventory[withdrawalCurrency];
  console.log(currencyMap);
  const atmInventoryMapKeys = getSortedMapKeys(currencyMap);
  atmInventoryMapKeys.forEach(mapKey => {
    remain = calculateBillsAndCoins(currencyMap, mapKey, remain, usedBills, usedCoins, usedBillsAndCoins, false);
  });

  if (isTooManyCoins(usedBillsAndCoins, atmInventoryMapKeys)){
    throw new Error('TooMuchCoinsException');
  }
  if (remain > 0){
    return false;
  }
  atmInventoryMapKeys.forEach(mapKey => {
    remain = calculateBillsAndCoins(currencyMap, mapKey, remain, usedBills, usedCoins, usedBillsAndCoins, true);
  });
  return usedBillsAndCoins;
}

function calculateBillsAndCoins(currencyMap, mapKey, remain, usedBills, usedCoins, usedBillsAndCoins, withdrawCash) {
  const billsAvailableAmount = currencyMap[mapKey].amount;
  const bill = Number(mapKey);
  if (billsAvailableAmount > 0 && remain >= bill) {
    const bankBill = Math.floor(remain / bill);
    const maxBillsUsed = Math.min(billsAvailableAmount, bankBill);

    splitBillsAndCoins(currencyMap, bill, usedBills, maxBillsUsed, usedCoins);

    usedBillsAndCoins.bills = [usedBills];
    usedBillsAndCoins.coins = [usedCoins];

    remain -= maxBillsUsed * bill;
    remain = Number.parseFloat(remain).toFixed(2);
    if (withdrawCash) {
      currencyMap[mapKey].amount -= maxBillsUsed; //actual withdraw cash after checking its valid
    }
  }
  return remain;
}

function splitBillsAndCoins(currencyMap, bill, usedBills, maxBillsUsed, usedCoins) {
  if (currencyMap[bill].type === 'bill') {
    usedBills[bill] = maxBillsUsed;
  }
  if (currencyMap[bill].type === 'coin') {
    usedCoins[bill] = maxBillsUsed;
  }
}

function getSortedMapKeys(currencyMap) {
  return Object.keys(currencyMap)
    .sort((a, b) => {
      return b - a;
    });
}

function isTooManyCoins(usedBills) {
  let count = 0;
  const coins = Object.values(usedBills.coins[0] || 0)
  coins.forEach(coin => count += (coin || 0))
  console.log(`coins count is ${count}`);
  return count > 50;
}

module.exports = {
  isValidWithdrawal,
  sendResponse,
  calculateResult,
  isTooManyCoins,
  calculateBillsAndCoins
}
