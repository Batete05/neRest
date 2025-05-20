const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

const Parking = sequelize.define("Parking", {
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  parking_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  n_space_available: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  charging_hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Parking.associate = (models) => {
  Parking.hasMany(models.CarEntry, {
    foreignKey: "parking_code",
    sourceKey: "code",
  });
};

module.exports = {
  Parking,
};
