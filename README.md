# atm-machine ATM Machine JavaScript
My special “ATM Machine” which accepts any required amount and returns an optimized response

This is an API based ATM returns an optimized response (Returning biggest bills or biggest coins it got) 
based on the current money that exists in the ATM.

### API Description:
1. Withdrawal request should use POST `/atm/withdrawal`
   with body : `{
   "currency": "ILS",
   "amount": 837.44,
   }`
2. Add different currency to ATM's inventory use POST `/admin/currency`
   with body: `{
   "currency": "USD",
   "currency_map": { "5": { "type": "coin", "amount": 1 },
   "10": { "type": "coin", "amount": 1 },
   "20": {  "type": "bill", "amount": 1 },
   "100": { "type": "bill",  "amount": 4 },
   "200": { "type": "bill", "amount": 7 },
   "0.1": { "type": "coin", "amount": 12 },
   "0.01": { "type": "coin",  "amount": 21 }
   }
   }`

### Running the AT app:
   1. clone this repo
   2. `npm install`
   3. `npm start`
