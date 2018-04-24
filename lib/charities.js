const donise = require('./donise')

const {
  Charity
} = require('../models')

function fetchAll (done) {
  donise(Charity.findAll({
    limit: 50,
    order: [['name', 'ASC']]
  }), done)
}

module.exports = {
  fetchAll
}