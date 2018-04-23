const superagent = require('superagent')
const config = require('./config')
const baseUrl = 'https://api.pandapay.io/v1/'

function catchError (done)  {
  return (err) => {
    const json = JSON.parse(err.response.text)
    done(new Error(json.errors.map(x => x.message).join(" / ")))
  }
}

function baseRequest(type, url, options) {
  return superagent[type](baseUrl + url)
    .auth(config.pandaPay.secretKey)
}
/*
curl https://api.pandapay.io/v1/donations \
       -u sk_test_abcdefghijklmnopqrstuvwx \     # Test API secret key
       -d amount=5000 \                          # Donation amount in cents
       -d currency="usd" \
       -d source=a1s2d3f4g5h6j7k8l9 \            # Panda.js card token
       -d receipt_email="test@pandapay.io" \     # Email to receive receipt
       -d platform_fee=100 \                     # Platform fee in cents
       -d destination_ein=12-3456789             # Recipient charity EIN
       */

function createDonation (donation, done) {
  console.log('donation',donation);
  //donation.source = 'a8cCQ0mUE3XVM9V7yuyE70fOok2'
  baseRequest('post', 'donations')
    .send(donation)
    .then((result) => {
      console.log('result.body',result.body);
      done(null, result.body)
    })
    .catch(catchError(done))
}

module.exports = {
  createDonation
}
