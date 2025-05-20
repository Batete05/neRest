// controllers/reportController.js
const { Op } = require("sequelize");
const { ParkingRecord } = require("../models");
const router = require("express").Router();

// 1. Get all outgoing cars and total amount charged between two datetimes
exports.getOutgoingCarsReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const outgoingCars = await ParkingRecord.findAll({
      where: {
        exit_time: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    const totalAmount = outgoingCars.reduce((sum, record) => sum + (record.charged_amount || 0), 0);

    res.status(200).json({
      total_amount: totalAmount,
      cars: outgoingCars
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. Get all entered cars between two datetimes
exports.getEnteredCarsReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const enteredCars = await ParkingRecord.findAll({
      where: {
        entry_time: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    res.status(200).json({ cars: enteredCars });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
