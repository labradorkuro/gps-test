﻿//
// 2017.03.08 t.tanaka
// Model
// 位置情報
//
var Sequelize = require('sequelize');

var Location = sequelize.define('location_tbl', {
  id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
	serialno: Sequelize.STRING,
	latitude: Sequelize.STRING,
	longitude: Sequelize.STRING,
	altitude: Sequelize.STRING,
  utc:  Sequelize.STRING,
  uploadtime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }

},
{
	schema:'location_system',
	underscored: true,
	timestamps: false
});
module.exports = function (sequelize, DataTypes) {
	return Location;
};
