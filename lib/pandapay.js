const superagent = require('superagent')
const config = require('/config')
const baseUrl = 'https://api.pandpay.io/v1/'

function baseRequest(type, url, options) {
  return superagent[type](baseUrl + url)
    .auth(null, config.pandaypay.secretKey)
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
  const body = {
    source: donation.token,
    currency: 'usd',
    amount: donation.amount,
    destination_ein: donation.ein
    receipt_email: donation.email,
    platform_fee: 0 //Could be a tip later on
  }
  donise(baseRequest('post', 'donations')
    .body(body))
}

module.exports = {
  createDonation
}
