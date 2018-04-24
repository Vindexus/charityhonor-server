const debug = require('debug')('charityhonor:server:routes:drives');
const express = require('express')
const router = express.Router()
const driveLib = require('../lib/drives')
const charityLib = require('../lib/charities')
const donise = require('../lib/donise')
const { Drive } = require('../models')
const config = require('../lib/config')

router.get('/:id', (req, res) => {
  driveLib.fetchBreakdown(req.params.id, (err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    res.send(result)
  })
})

router.get('/claim/:claim', (req, res) => {
  driveLib.fetchByClaim(req.params.claim, (err, drive) => {
      console.log('drive', drive);
    if (err) {
      res.sendError(err)
      return
    }

    charityLib.fetchAll((err, charities) => {
      if (err) {
        res.sendError(err)
        return
      }

      const scope = {
        drive,
        charities
      }
      res.send(scope)
    })
  })
})

router.get('/', (req, res) => {
  res.send('get drives')
})

router.post('/', (req, res) => {
  console.log('posting to drive');
  driveLib.create(req.body, (err, result) => {
    console.log('result', result);
    console.log('err',err);
    if (err) {
      res.status(500).send({error: err.toString()})
      return
    }

    res.send(result.toJSON())
  })
})

module.exports = router;
