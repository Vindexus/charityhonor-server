const debug = require('debug')('charityhonor:server:routes:donations');
const express = require('express')
const router = express.Router()
const donationLib = require('../lib/donations')
const driveLib = require('../lib/drives')

router.post('/', (req, res) => {
  const body =  req.body

  driveLib.fetchById(req.body.drive_id, (err, drive) => {
    if (err) {
      res.sendError(err)
      return
    }

    body.eid = drive.panda_destination_eid || ""
    body.drive_id = drive.id
    donationLib.create(body, (err, donation) => {
      if (err) {
        res.sendError(err)
        return
      }

      res.status(200).send(donation)
    })
  })
})

module.exports = router;
