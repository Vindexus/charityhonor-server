'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Charities', [{
      name: 'Electronic Frontier Foundation Inc.',
      pandapay_ein: '43-091431',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'American National Red Cross',
      pandapay_ein: '53-0196605',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Breast Cancer Research Foundation',
      pandapay_ein: '13-3727250',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Charities', null, {});
  }
};
