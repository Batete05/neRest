const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

//Modal definition of the user of our parking management app
const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("ADMIN","ATTENDANT"),
    defaultValue: "ATTENDANT",
    allowNull: false,
  },
//   isVerified: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
});

module.exports = { User };
