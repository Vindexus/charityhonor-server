const debug = require('debug')('charityhonor:server:routes:drives');
const express = require('express')
const router = express.Router()
const driveLib = require('../lib/drives')
const donise = require('../lib/donise')
const { Drive } = require('../models')
const config = require('../lib/config')

router.get('/:id', (req, res) => {
  driveLib.fetchBreakdown(req.params.id, (err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    const scope = Object.assign(result, {
      prefillDonation: config.prefillDonation || {},
      pandaPayJavaScriptSrc: config.pandaPay.javaScriptSrc
    })
    res.render('drives/view', scope)
  })
})

router.get('/claim/:claim', (req, res) => {
  driveLib.fetchByClaim(req.params.id, (err, result) => {
    if (err) {
      res.sendError(err)
      return
    }

    const scope = Object.assign(result, {
      prefillDonation: config.prefillDonation || {},
      pandaPayJavaScriptSrc: config.pandaPay.javaScriptSrc
    })
    res.render('drives/view', scope)
  })
})


router.post('/', (req, res) => {
  driveLib.create(req.body, (err, result) => {
    if (err) {
      res.status(500).send({error: err.toString()})
      return
    }

    res.send(result)
  })
})

module.exports = router;
