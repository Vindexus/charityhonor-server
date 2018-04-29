const debug = require('debug')('charityhonor:server:routes:donations');
const express = require('express')
const router = express.Router()
const donationLib = require('../lib/donations')
const driveLib = require('../lib/drives')

router.post('/', (req, res) => {
  const body =  req.body

  //Find the drive they are donating to
  driveLib.fetchById(req.body.drive_id, (err, drive) => {
    if (err) {
      res.sendError(err)
      return
    }

    body.drive_id = drive.id
    donationLib.create(body, (err, result) => {
      if (err) {
        res.sendError(err)
        return
      }

      res.status(200).send(result)
    })
  })
})

router.get('/latest', (req, res) => {
  donationLib.fetchLatestDonations({}, res.jsonDone)
})

module.exports = router;
