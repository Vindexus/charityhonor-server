'use strict';

module.exports = (sequelize, DataTypes) => {
  const Drive = sequelize.define('Drive', {
    reddit_id: DataTypes.STRING,
    reddit_author: DataTypes.STRING,
    reddit_content: DataTypes.STRING,
    reddit_title: DataTypes.STRING,
    reddit_type: DataTypes.STRING,
    reddit_subreddit: DataTypes.STRING,
    reddit_permalink: DataTypes.STRING,
    initiator_name: DataTypes.STRING,
    initiator_token: DataTypes.STRING,
    initiator_claimed: DataTypes.BOOLEAN,
    initiator_claimed_at: DataTypes.DATE,
    charity_id: DataTypes.INTEGER, //TODO: Foreign key obvi
    charity_claim_token: DataTypes.STRING,
    charity_claimed_at: DataTypes.STRING,
    num_donations: DataTypes.INTEGER,
    total_amount: DataTypes.INTEGER
  }, {});
  Drive.associate = function(models) {
    models.Drive.hasMany(models.Donation, {foreignKey: 'drive_id'})
  };

  return Drive;
};
