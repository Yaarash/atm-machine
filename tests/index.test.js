const request = require('supertest');
const { createServer } = require('../src/index')

const app = createServer();

describe('POST /admin/currency', function() {
  const newCurrencyToAdd = {
    "currency": "USD",
    "currency_map": {
      "5": {
        "type": "coin",
        "amount": 1
      },
      "10": {
        "type": "coin",
        "amount": 1
      },
      "20": {
        "type": "bill",
        "amount": 1
      },
      "100": {
        "type": "bill",
        "amount": 4
      },
      "200": {
        "type": "bill",
        "amount": 7
      },
      "0.1": {
        "type": "coin",
        "amount": 12
      },
      "0.01": {
        "type": "coin",
        "amount": 21
      }
    }
  }
  it('responds with 200 status code', function(done) {
    request(app)
      .post('/admin/currency')
      .send(newCurrencyToAdd)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
