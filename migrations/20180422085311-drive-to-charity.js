'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Drives', 'drive_id', {
      type: Sequelize.INTEGER,
        references: {
          model: 'Charities',
          key: 'id'
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Drives', 'drive_id');
  }
};