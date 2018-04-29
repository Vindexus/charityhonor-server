'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('do the query');
    return queryInterface.createTable('Drives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reddit_id: {
        type: Sequelize.STRING
      },
      reddit_type: {
        type: Sequelize.STRING
      },
      reddit_author: {
        type: Sequelize.STRING
      },
      reddit_content: {
        type: Sequelize.TEXT
      },
      reddit_title: {
        type: Sequelize.STRING
      },
      reddit_subreddit: {
        type: Sequelize.STRING
      },
      reddit_permalink: {
        type: Sequelize.STRING
      },
      initiator_name: {
        type: Sequelize.STRING
      },
      initiator_token: {
        type: Sequelize.STRING
      },
      initiator_claimed: {
        type: Sequelize.BOOLEAN
      },
      initiator_claimed_at: {
        type: Sequelize.DATE
      },
      charity_id: {
        type: Sequelize.INTEGER
      },
      charity_claim_token: {
        type: Sequelize.STRING
      },
      charity_claimed_at: {
        type: Sequelize.DATE
      },
      num_donations: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    return queryInterface.dropTable('Drives');
  }
};