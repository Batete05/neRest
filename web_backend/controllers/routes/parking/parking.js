const { verifyToken } = require("../../../middlewares/verifyToken");
const { validateParking } = require("../../../validators/parkingValidator");
const { Parking } = require("../../../models/parking");
const { Op } = require("sequelize");
const { authorizeRoles } = require("../../../middlewares/authMiddleware");
const { sequelize } = require("../../../config/dbConnection");

const router = require("express").Router();

require("dotenv").config();

router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const { error } = validateParking(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existByCode = await Parking.findOne({
      where: { code: req.body.code },
    });

    if (existByCode) {
      return res.status(400).json({ message: "This Parking already exist" });
    }

    const newParking = await Parking.create({
      code: req.body.code,
      parking_name: req.body.parking_name,
      n_space_available: req.body.n_space_available,
      location: req.body.location,
      charging_hour: req.body.charging_hour,
    });

    return res
      .status(200)
      .json({ message: "Success Parking added", data: newParking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const findParking = await Parking.findAll();
    if (!findParking) {
      return res.status(400).jaon({ message: "Can't get any Parking" });
    }
    return res.status(200).json({ message: findParking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;

      const [updatedRowsCount] = await Parking.update(updatedData, {
        where: { id: userId },
      });

      if (updatedRowsCount === 0) {
        return res
          .status(404)
          .json({ message: "Parking not found or no changes made" });
      }

      // Fetch the updated Book data
      const updatedParking = await Book.findByPk(userId);

      return res.status(200).json(updatedParking);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const parkingToDelete = Parking.findAll(req.params.id);
    if (!parkingToDelete) {
      return res.status(404).json({ message: "Parking not found" });
    }
    await Parking.destroy();
    res.status(200).json({ message: "Parking deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete Parking Error" + err.message });
  }
});

// READ all Books with pagination
router.get("/", verifyToken, async (req, res) => {
  try {
    // Read query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: Books } = await Parking.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });
    // http://localhost:5000/v1/Parking?page=2&limit=2

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      Books,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Parkings" + err.message });
  }
});

router.get("/search", async (req, res) => {
  const searchKeyword = req.query.q;
  if (!searchKeyword) {
    return res.status(400).json({ message: "Search keyword is required" });
  }
  try {
    const Parking = await Parking.findAll({
      where: {
        [Op.or]: [
          { code: { [Op.iLike]: `%${searchKeyword}%` } },
          { parking_name: { [Op.iLike]: `%${searchKeyword}%` } },
          { n_space_available: { [Op.iLike]: `%${searchKeyword}%` } },
          { location: { [Op.iLike]: `%${searchKeyword}%` } },
          { charging_hour: { [Op.iLike]: `%${searchKeyword}%` } },
        ],
      },
    });
    return res.send({ Parking });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
