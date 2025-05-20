const { authorizeRoles } = require("../../../middlewares/authMiddleware");
const { verifyToken } = require("../../../middlewares/verifyToken");
const { CarEntry } = require("../../../models/carEntry");
const { Parking } = require("../../../models/parking");
const { validateCarEntry } = require("../../../validators/carEntryValidator");
const router = require("express").Router();
router.post(
  "/entry",
  verifyToken,
  authorizeRoles("ATTENDANT"),
  async (req, res) => {
    const { error } = validateCarEntry(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { plate_number, parking_code } = req.body;

    const parking = await Parking.findOne({ where: { code: parking_code } });
    if (!parking) return res.status(404).json({ message: "Parking not found" });

    if (parking.n_space_available <= 0) {
      return res.status(400).json({ message: "No parking space available" });
    }

    const newEntry = await CarEntry.create({
      plate_number,
      parking_code,
    });

    // Decrease available spaces
    await parking.update({ n_space_available: parking.n_space_available - 1 });

    res.status(200).json({
      message: "Car Entry Registered",
      ticket: newEntry,
    });
  }
);

router.put("/exit/:id", async (req, res) => {
  const entry = await CarEntry.findByPk(req.params.id);
  if (!entry || entry.exit_time)
    return res.status(404).json({ message: "Invalid or already exited" });

  const exit_time = new Date();
  const entry_time = new Date(entry.entry_time);
  const hours = Math.ceil((exit_time - entry_time) / (1000 * 60 * 60));

  const parking = await Parking.findOne({
    where: { code: entry.parking_code },
  });
  const charged_amount = hours * parking.charging_hour;

  await entry.update({ exit_time, charged_amount });

  // Increase available spaces
  await parking.update({ n_space_available: parking.n_space_available + 1 });

  res.status(200).json({
    message: "Exit Registered",
    duration: `${hours} hours`,
    charged_amount,
    details: entry,
  });
});

module.exports = router;
