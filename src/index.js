const express = require('express');
const _ = require('lodash');

const app = express();
app.use(express.json());

let ATM_MAP = _initBillsCoinsMap();

const MAX_AMOUNT = 2000;

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/atm/withdrawal", (req, res, next) => {
  console.log(JSON.stringify(ATM_MAP));
  const currency = req.query.currency;
  const withdrawlAmount = Number(req.query.amount);
  if (!_isValidWithdrawl(withdrawlAmount)) {
    return sendResponse (res, 400, 'error: Max amount for a single withdrawal is 2000');
  }
  try {
    const result = calculateResult(withdrawlAmount, currency);
  if (!result) {
    return sendResponse (res, 409, 'error: Not enough money in the ATM, please try a different amount');
  }
  return res.send({result});

  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'error: Too many coins to withdraw');
  }
});

app.post("/admin/currency", (req, res) => {
  console.log(req);
  const currency = req.body.currency;
  const currencyMap = req.body.currency_map;
  ATM_MAP[currency] = currencyMap;
  console.log(ATM_MAP);
  return sendResponse(res);
})

function _initBillsCoinsMap() {
  return {
    "ILS": {
      200: {'type': 'bill', 'amount': 7},
      100: {'type': 'bill', 'amount': 4},
      20: {'type': 'bill', 'amount': 1},
      10: {'type': 'coin', 'amount': 1},
      5: {'type': 'coin', 'amount': 1},
      0.1: {'type': 'coin', 'amount': 12},
      0.01: {'type': 'coin', 'amount': 21}
    }
  }

}
function sendResponse(res, statusCode = 200, message = '') {
  return res.status(statusCode)
    .send({ message});
}
function _isValidWithdrawl(withdrawlAmount) {
  return withdrawlAmount <= MAX_AMOUNT;
}


function calculateResult(withdrawlAmount, withdrawlcurrency) {
  let remain = withdrawlAmount;
  const used = {
    "bills": [],
    "coins": []
  }
  const usedBills = {};
  const usedCoins = {};
  const currencyMap = ATM_MAP[withdrawlcurrency];
  console.log(currencyMap);
  let mapKeys = Object.keys(currencyMap).sort((a, b) => {return b-a});
  for(let i = 0; i < mapKeys.length; i++) {
    let billsAvailableAmount = currencyMap[mapKeys[i]].amount;
    const bill = Number(mapKeys[i]);
    if (billsAvailableAmount > 0 && remain >= bill) {
      const bankBill = Math.floor(remain / bill);
      const maxBillsUsed = Math.min(billsAvailableAmount, bankBill)
      if (currencyMap[bill].type === 'bill') {
        usedBills[bill] = maxBillsUsed;
      }
      if (currencyMap[bill].type === 'coin') {
        usedCoins[bill] = maxBillsUsed;
      }
      console.log(`usedBillsa: ${JSON.stringify(usedBills)}`);
      console.log(`usedCoinsa: ${JSON.stringify(usedCoins)}`);
      used.bills = [usedBills];
      used.coins = [usedCoins];
      console.log(`used!! ${JSON.stringify(used)}`);

      billsAvailableAmount -= maxBillsUsed;
      remain -= maxBillsUsed * bill;
    }
  }

  if (_isTooManyCoins(used, mapKeys)){
    throw new Error('TooMuchCoinsException');
  }
  if (remain > 0){
    return false;
  }
  return used;
}

function _isTooManyCoins(usedBills) {
  let sum = 0;
  const coins = Object.values(usedBills.coins[0] || 0)
  coins.forEach(coin => sum += (coin || 0))
  console.log(`sum is ${sum}`);
  return sum > 50;
}

function getSortedMapKeys() {
  return Object.keys(ATM_MAP)
    .sort((a, b) => {
      return b - a;
    });
}


