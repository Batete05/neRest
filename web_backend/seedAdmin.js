const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { User } = require("./models/user.js");

dotenv.config();

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ where: { role: "ADMIN" } });

    if (!adminExists) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

      // Create the admin user
      await User.create({
        firstName: "Batete",
        lastName: "Ange",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      });

      console.log("Admin user created successfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error creating admin:", error.message || error);
  }
};

seedAdmin();
