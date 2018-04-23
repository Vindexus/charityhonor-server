'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reddit_username: {
        type: Sequelize.STRING
      },
      reddit_username_claim_token: {
        type: Sequelize.STRING
      },
      reddit_username_claimed: {
        type: Sequelize.BOOLEAN
      },
      charge_amount: {
        type: Sequelize.INTEGER
      },
      platform_fee: {
        type: Sequelize.INTEGER
      },
      donation_after_fees: {
        type: Sequelize.INTEGER
      },
      pandapay_token: {
        type: Sequelize.STRING
      },
      pandapay_donation_id: {
        type: Sequelize.STRING
      },
      drive_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Drives',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Donations');
  }
};