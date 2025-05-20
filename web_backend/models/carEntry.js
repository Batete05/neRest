// models/carEntry.js
const { sequelize } = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const CarEntry = sequelize.define("CarEntry", {
  plate_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parking_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entry_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  exit_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  charged_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

CarEntry.associate = (models) => {
  CarEntry.belongsTo(models.Parking, {
    foreignKey: "parking_code",
    targetKey: "code",
  });
};

module.exports = { CarEntry };
