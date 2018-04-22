const debug = require('debug')('charityhonor:server:lib:drives');
const reddit = require('./reddit')
const async = require('async')
const donise = require('./donise')

const { Donation } = require('../models')


function validateDonation (body, done) {
  if (!body.token) {
    done(new Error('Token is required'))
    return
  }

  done(null)
}

function create (body, done) {
  validateDonation(body, (err) => {
    if (err) {
      debug(err)
      done(err)
      return
    }

    const donation = {

    }

    donise(Donation.create(donation), done)
  })
}

module.exports = {
  validateDonation,
  create
}
