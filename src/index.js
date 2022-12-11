const express = require('express');
const { isValidWithdrawal, sendResponse, calculateResult } = require('./utils.js');

const ATM_INVENTORY_MAP = initBillsCoinsMap();
const MAX_AMOUNT = 2000;

function createServer() {
  const app = express();
  app.use(express.json());
  app.post("/atm/withdrawal", handleWithdrawal);
  app.post("/admin/currency", handleAdminCurrencyAddition);
  return app;
}

function initBillsCoinsMap() {
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

function handleAdminCurrencyAddition(req, res) {
  const { currency } = req.body;
  const { currency_map: currencyMap } = req.body;
  ATM_INVENTORY_MAP[currency] = currencyMap;
  return sendResponse(res);
}

function handleWithdrawal(req, res) {
  const { currency, amount } = req.body;
  const withdrawalAmount = Number.parseFloat(amount).toFixed(2);

  if (!isValidWithdrawal(withdrawalAmount, MAX_AMOUNT)) {
    return sendResponse(res, 400, `error: Max amount for a single withdrawal is ${MAX_AMOUNT}`);
  }
  let result;
  try {
    result = calculateResult(withdrawalAmount, currency, ATM_INVENTORY_MAP);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'error: Too many coins to withdraw');
  }
  if (!result) {
    return sendResponse(res, 409, 'error: Not enough money in the ATM, please try a different amount');
  }
  return res.send({ result });
}

// app.post("/atm/withdrawal", handleWithdrawal);
//
// app.post("/admin/currency", handleAdminCurrencyAddition);
const app = createServer();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = { handleAdminCurrencyAddition, createServer }
