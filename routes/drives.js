const debug = require('debug')('charityhonor:server:routes:drives');
const express = require('express')
const router = express.Router()
const driveLib = require('../lib/drives')
const donise = require('../lib/donise')
const { Drive } = require('../models')
const config = require('../lib/config')

router.get('/:id', (req, res) => {
  console.log('doin it');
  console.log('req.params.id',req.params.id);
  donise(Drive.findById(req.params.id), (err, drive) => {
    res.render('drives/view', {
      drive,
      pandaPayJavaScriptSrc: config.pandaPay.javaScriptSrc
    })
    if (err) {
      res.sendError(err)
      return
    }
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
