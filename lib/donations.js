const debug = require('debug')('charityhonor:server:lib:drives');
const reddit = require('./reddit')
const async = require('async')
const donise = require('./donise')
const driveUtil = require('./drives')
const pandapayUtil = require('./pandapay')

const {
  Donation,
  Drive
} = require('../models')

/**
 * Validates given JSON body data for a new donation
 *
 * @param {Object} body
 * @param {Function} done
 */
function validateDonation (body, done) {
  console.log('body',body);
  if (!body.pandapay_token) {
    done(new Error('Token is required'))
    return
  }

  if (!body.email) {
    done(new Error('Receipt email is required'))
    return
  }

  if (!body.amount || body.amount < 0) {
    done(new Error('Amount must be greater than 0'))
    return
  }

  console.log('validation is all good');
  done(null)
}

/**
 * Takes in body params and creates a donation for a drive
 *
 * @param {Object} body
 * @param {Number} body.drive_id The ID of the drive
 * @param {Number} body.amount The donation amount in dollars
 * @param {String} body.email The donor's receipt email
 * @param {Function} done
  */
function create (body, done) {
  async.waterfall([
  //Validate what they've sent us
  (next) => {
    validateDonation(body, next)
  },
  //Find the drive
  (next) => {
    driveUtil.fetchById(body.drive_id, (err, drive) => {
      if (err) {
        next(err)
        return
      }

      next(null, drive)
    })
  },
  //Create the donation in PandaPay
  (drive, next) => {
    const donation = {
      amount: body.amount * 100,
      currency: 'usd',
      receipt_email: body.email,
      platform_fee: 0,
      source: body.pandapay_token
    }

    if (drive.destination_ein) {
      donation.destination_ein = drive.destination_ein
    }

    pandapayUtil.createDonation(donation, (err, pandaDonation) => {
      if (err) {
        next(err)
        return
      }
      next(null, pandaDonation, drive)
    })
  },
  //Save the donation in our database
  (pandaDonation, drive, next) => {
    const donation = {
      drive_id: drive.id,
      charge_amount: pandaDonation.charge_amount,
      platform_fee: pandaDonation.platform_fee,
      donation_after_fees: pandaDonation.donation_after_fees,
      pandapay_token: pandaDonation.payment_token,
      pandapay_donation_id: pandaDonation.id
    }
    donise(Donation.create(donation), (err, donation) => {
      next(err, donation, drive)
    })
  },
  //Update the totals of the Drive
  (donation, drive, next) => {
    driveUtil.updateStats(drive.id, (err, drive) => {
      if (err) {
        next(err)
        return
      }

      next(err, donation, drive)
    })
  }],
  (err, donation, drive) => {
    if (err) {
      done(err)
      return
    }

    done(null, {
      drive,
      donation
    })
  })
}

module.exports = {
  validateDonation,
  create
}
