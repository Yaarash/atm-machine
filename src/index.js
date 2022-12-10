const express = require('express');
const _ = require('lodash');

const app = express();

let map1 = _initBillsCoinsMap();

const MAX_AMOUNT = 2000;

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/atm/withdrawal", (req, res, next) => {
  // const currency = req.params.currency;
  const withdrawlAmount = Number(req.query.amount);
  if (!_isValidWithdrawl(withdrawlAmount)) {
    return sendResponse (res, 400, 'error: Max amount for a single withdrawal is 2000');
  }
  const result = calculateResult(withdrawlAmount);
  if (!result) {
    return sendResponse (res, 409, 'error: Not enough money in the ATM, please try a different amount');
  }
  console.log(map1);
  return res.send({result});
});

function _initBillsCoinsMap() {
  return {
    200: {'type': 'bill' ,'value': 200, 'amount': 7},
    100: {'type': 'bill','value': 100, 'amount': 4},
    20: {'type': 'bill','value': 20, 'amount': 1},
    10: {'type': 'coin','value': 10, 'amount': 1},
    5: {'type': 'coin','value': 5, 'amount': 1},
    0.1: {'type': 'coin','value': 0.1, 'amount': 12},
    0.01: {'type': 'coin','value': 0.01, 'amount': 21}
  }

}
function sendResponse(res, statusCode = 200, message = '') {
  return res.status(statusCode)
    .send({ message});
}
function _isValidWithdrawl(withdrawlAmount) {
  return withdrawlAmount <= MAX_AMOUNT;
}

function isTooManyCoins(usedBills, mapKeys) {
  let sum = 0;
  const coins = usedBills.filter(coin => coin.type === 'coin');
  coins.forEach(coin => mapKeys.forEach(key => sum += (coin[key] || 0) ));
  console.log(`sum is ${sum}`);
  return sum > 50;
}


function calculateResult(withdrawlAmount) {
  let remain = withdrawlAmount;
  let usedBills = [];
  let mapKeys = Object.keys(map1).sort((a, b) => {return b-a});
  for(let i = 0; i < mapKeys.length; i++) {
    let tempBillsAmount = map1[mapKeys[i]].amount;
    const bill = Number(mapKeys[i]);
    if (tempBillsAmount > 0 && remain >= bill) {
      const bankBill = Math.floor(remain / bill);
      const maxBillsUsed = Math.min(tempBillsAmount, bankBill)
      const objp = { type: map1[bill].type };
      objp[bill] = maxBillsUsed;
      usedBills.push(objp);
      console.log(usedBills);

      tempBillsAmount -= maxBillsUsed;
      remain -= maxBillsUsed * bill;
    }
  }

  if (isTooManyCoins(usedBills, mapKeys))
  console.log(usedBills);
  const formattedResponse = _.keyBy(usedBills, 'type');
  if (remain > 0){
    return false;
  }
  console.log(usedBills);
  return {
    "bill": usedBills.filter(usedBill => usedBill.type === "bill"),
    "coin": usedBills.filter(usedBill => usedBill.type === "coin")
  };
  //TODO change response format
}

function getSortedMapKeys() {
  return Object.keys(map1)
    .sort((a, b) => {
      return b - a;
    });
}


