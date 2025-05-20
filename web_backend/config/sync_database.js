const { sequelize } = require("./dbConnection");

// Register models before sync
require("../models/user");
require("../models/parking")
require("../models/carEntry")
// require("../models/oneTimeCode");
// require("../models/bookRequest")

sequelize
  .sync({ alter: true }) // <-- auto updates schema without deleting
  .then(() => console.log("✅ All models synchronized (altered) with DB."))
  .catch((err) => console.error("❌ Sync failed:", err));
