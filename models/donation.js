'use strict';

module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    reddit_username: DataTypes.STRING,
    reddit_username_claim_token: DataTypes.STRING,
    reddit_username_claimed: DataTypes.BOOLEAN,
    amount: DataTypes.INTEGER,
    drive_id: DataTypes.INTEGER
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
    models.Donation.belongsTo(models.Drive, {foreignKey: 'drive_id'})
  };

  return Donation;
};