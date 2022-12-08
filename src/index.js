const express = require('express');

const app = express();

let map1 = _initBillsCoinsMap();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/atm/withdrawal", (req, res, next) => {
  // const currency = req.params.currency;
  const withdrawlAmount = Number(req.query.amount);
  const result = calculateResult(withdrawlAmount);
  console.log(map1);
  return res.send(result);
});

function _initBillsCoinsMap() {
  return {
    200: {'type': 'bill' ,'value': 200, 'amount': 7},
    100: {'type': 'bill','value': 100, 'amount': 4},
    10: {'type': 'coin','value': 10, 'amount': 0},
    5: {'type': 'coin','value': 5, 'amount': 1},
    0.1: {'type': 'coin','value': 0.1, 'amount': 12},
    0.01: {'type': 'coin','value': 0.01, 'amount': 21}
  }
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
      const objp = {type: map1[bill].type};
      objp[bill] = maxBillsUsed;
      usedBills.push(objp);
      console.log(usedBills);

      tempBillsAmount -= maxBillsUsed;
      remain -= maxBillsUsed * bill;
    }
  }
  if (remain > 0){
    return {
      "msg": "Not enough bills and coins in ATM",
      "bill": usedBills.filter(usedBill => usedBill.type === "bill"),
      "coin": usedBills.filter(usedBill => usedBill.type === "coin")
    }
  }
  console.log(usedBills);
  return {
    "bill": usedBills.filter(usedBill => usedBill.type === "bill"),
    "coin": usedBills.filter(usedBill => usedBill.type === "coin")
  };
  //TODO change response format
}
