const donise = require('./donise')

const {
  Charity
} = require('../models')

function findAll (done) {
  donise(Charity.findAll({
    limit: 40,
    order: [['name', 'ASC']]
  }), done)
}

function findById (id, done) {
  console.log('CHARITY FIND BY ID');
  donise(Charity.findById(id), done)
}

module.exports = {
  findAll,
  findById
}
