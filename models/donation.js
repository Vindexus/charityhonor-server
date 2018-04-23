'use strict';

module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    reddit_username: DataTypes.STRING,
    reddit_username_claim_token: DataTypes.STRING,
    reddit_username_claimed: DataTypes.BOOLEAN,
    charge_amount: DataTypes.INTEGER,
    donation_after_fees: DataTypes.INTEGER,
    platform_fee: DataTypes.INTEGER,
    drive_id: DataTypes.INTEGER,
    pandapay_token: DataTypes.STRING,
    pandapay_donation_id: DataTypes.STRING
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
    models.Donation.belongsTo(models.Drive, {foreignKey: 'drive_id'})
  };

  return Donation;
};