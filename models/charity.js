'use strict';

module.exports = (sequelize, DataTypes) => {
  const Charity = sequelize.define('Charity', {
    pandapay_ein: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Charity.associate = function(models) {
  };


  return Charity;
};