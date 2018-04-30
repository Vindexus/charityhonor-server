const debug = require('debug')('charityhonor:server:routes:drives');
const express = require('express')
const router = express.Router()
const driveLib = require('../lib/drives')
const charityLib = require('../lib/charities')
const donise = require('../lib/donise')
const { Drive } = require('../models')
const config = require('../lib/config')

router.get('/latest', (req, res) => {
  driveLib.findLatest((err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    result.rows = result.rows.map(driveLib.driveToReturnObject)

    res.send(result)
  })
})

router.get('/top', (req, res) => {
  driveLib.findTop((err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    result.rows = result.rows.map(driveLib.driveToReturnObject)

    res.send(result)
  })
})

router.get('/:id', (req, res) => {
  driveLib.findBreakdown(req.params.id, (err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    result.drive = driveLib.driveToReturnObject(result.drive)

    res.send(result)
  })
})

router.patch('/token/:token', (req, res) => {
  driveLib.chooseCharity(req.params.token, req.body.charityId, (err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    res.send(result)
  })
})

router.get('/token/:token', (req, res) => {
  driveLib.findByToken(req.params.token, (err, drive) => {
    if (err) {
      res.sendError(err)
      return
    }

    charityLib.findAll((err, charities) => {
      if (err) {
        res.sendError(err)
        return
      }

      const scope = {
        drive: driveLib.driveToReturnObject(drive),
        charities
      }
      res.send(scope)
    })
  })
})

router.post('/', (req, res) => {
  driveLib.create(req.body, (err, result) => {
    console.log(result.charity_claim_token);
    if (err) {
      res.status(500).send({error: err.toString()})
      return
    }

    res.send(result)
  })
})

module.exports = router;
