//
// 2017.03.27 t.tanaka
// Model
// 土中湿度と温度湿度データ
//
var Sequelize = require('sequelize');

var Moist = sequelize.define('moist_tbl', {
  id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
	serialno: Sequelize.STRING,
	moist_1: Sequelize.INTEGER,
	moist_2: Sequelize.INTEGER,
	temperature: Sequelize.INTEGER,
  humidity:  Sequelize.INTEGER,
  uploadtime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }

},
{
	schema:'location_system',
	underscored: true,
	timestamps: false
});
module.exports = function (sequelize, DataTypes) {
	return Moist;
};
