const debug = require('debug')('charityhonor:server:routes:index');
const express = require('express');
const router = express.Router();
const driveLib = require('../lib/drives')

/* GET home page. */
router.get('/', function(req, res, next) {
  driveLib.findRecents((err, drives) => {
    if (err) {
      debug(err)
    }
    debug(drives, drives)
    console.log('drives',drives);
    res.render('index', { title: 'Charity Honor', drives: drives});
  })
})

module.exports = router;
