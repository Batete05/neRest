// models/ParkingRecord.js
const { sequelize } = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const ParkingRecord = sequelize.define("ParkingRecord", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
  plate_number: DataTypes.STRING,
  parking_code: DataTypes.STRING,
  entry_time: DataTypes.DATE,
  exit_time: DataTypes.DATE,
  charged_amount: DataTypes.FLOAT,
});

module.export = {
  ParkingRecord,
};
