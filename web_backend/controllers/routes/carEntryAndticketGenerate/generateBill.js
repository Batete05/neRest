const { CarEntry } = require("../../../models/carEntry");
const { Parking } = require("../../../models/parking");
const router = require("express").Router();

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

module.exports= router