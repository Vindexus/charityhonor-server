'use strict';

module.exports = (sequelize, DataTypes) => {
  const Charity = sequelize.define('Charity', {
    pandapay_destination_eid: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Charity.associate = function(models) {
    // associations can be defined here
    models.Charity.hasMany(models.Drive, {foreignKey: 'charity_id'})
  };


  return Charity;
};