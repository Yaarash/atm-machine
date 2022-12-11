const { isTooManyCoins, calculateBillsAndCoins,
  calculateResult
} = require('../src/utils');

describe('utils functions test', () => {

  test('isTooManyCoins false', () =>{
    const usedBillsAndCoins = {
      "bills": [{"20":1,"200":4}],
      "coins": [{"10":1,"0.01":2}]
    }

    const isTooManyCoinsResult = isTooManyCoins(usedBillsAndCoins);

    expect(isTooManyCoinsResult).toBeFalsy();
  })

  test('isTooManyCoins true', () => {
    const usedBillsAndCoins = {
      "bills": [{"20":1,"200":4}],
      "coins": [{"10":26,"0.01":26}]
    }

    const isTooManyCoinsResult = isTooManyCoins(usedBillsAndCoins);

    expect(isTooManyCoinsResult).toBeTruthy();
  })

  test('calculateBillsAndCoins return zero remain', () => {
    const currencyMap = {
      200: {'type': 'bill', 'amount': 7},
      100: {'type': 'bill', 'amount': 4},
      20: {'type': 'bill', 'amount': 1},
      10: {'type': 'coin', 'amount': 1},
      5: {'type': 'coin', 'amount': 1},
      0.1: {'type': 'coin', 'amount': 12},
      0.01: {'type': 'coin', 'amount': 21}
    };
    const mapKey = 100;
    const remain = 200;
    const usedBillsAndCoins = {
      "bills": [],
      "coins": []
    }

    const result = calculateBillsAndCoins(currencyMap, mapKey, remain, {}, {}, usedBillsAndCoins, false);
    expect(result).toBe("0.00");
  });

  test('calculateBillsAndCoins return 50 remain', () => {
    const currencyMap = {
      200: {'type': 'bill', 'amount': 7},
      100: {'type': 'bill', 'amount': 4},
      20: {'type': 'bill', 'amount': 1},
      10: {'type': 'coin', 'amount': 1},
      5: {'type': 'coin', 'amount': 1},
      0.1: {'type': 'coin', 'amount': 12},
      0.01: {'type': 'coin', 'amount': 21}
    };
    const usedBillsAndCoins = {
      "bills": [],
      "coins": []
    }

    const result = calculateBillsAndCoins(currencyMap, 100, 150, {}, {}, usedBillsAndCoins, false);
    expect(result).toBe("50.00");
  });

  test('calculateResult of valid withdrawal amount', () => {
    const ATM_INVENTORY_MAP = {
      "ILS": {
        200: {'type': 'bill', 'amount': 7},
        100: {'type': 'bill', 'amount': 4},
        20: {'type': 'bill', 'amount': 1},
        10: {'type': 'coin', 'amount': 1},
        5: {'type': 'coin', 'amount': 1},
        0.1: {'type': 'coin', 'amount': 12},
        0.01: {'type': 'coin', 'amount': 21}
      }
    };

    const result = calculateResult(830.20, "ILS", ATM_INVENTORY_MAP);
    const expectedResult = {"bills":[{"20":1,"200":4}],"coins":[{"10":1,"0.1":2}]}
    expect(result).toStrictEqual(expectedResult);
  })

  test('calculateResult of zero', () => {
    const ATM_INVENTORY_MAP = {
      "ILS": {
        200: {'type': 'bill', 'amount': 7},
        100: {'type': 'bill', 'amount': 4},
        20: {'type': 'bill', 'amount': 1},
        10: {'type': 'coin', 'amount': 1},
        5: {'type': 'coin', 'amount': 1},
        0.1: {'type': 'coin', 'amount': 12},
        0.01: {'type': 'coin', 'amount': 21}
      }
    };

    const result = calculateResult(0, "ILS", ATM_INVENTORY_MAP);
    const expectedResult = {"bills":[],"coins":[]}
    expect(result).toStrictEqual(expectedResult);
  });

  test('calculateResult of unavailable currency', () => {
    const ATM_INVENTORY_MAP = {
      "ILS": {
        200: {'type': 'bill', 'amount': 7},
        100: {'type': 'bill', 'amount': 4},
        20: {'type': 'bill', 'amount': 1},
        10: {'type': 'coin', 'amount': 1},
        5: {'type': 'coin', 'amount': 1},
        0.1: {'type': 'coin', 'amount': 12},
        0.01: {'type': 'coin', 'amount': 21}
      }
    };

    const result = calculateResult(0, "USD", ATM_INVENTORY_MAP);
    const expectedResult = {"bills":[],"coins":[]}
    expect(result).toStrictEqual(expectedResult);
  });
})
