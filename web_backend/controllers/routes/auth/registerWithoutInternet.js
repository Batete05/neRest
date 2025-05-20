const router = require("express").Router();
const { User } = require("../../../models/user"); // Sequelize User model
const { validateUser } = require("../../../validators/userValidator"); // Joi validators
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getRandomStringFromArray } = require("../../../utils/extractors");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    
    // Validate user input
    const { error } = validateUser(req.body);

    if (error) {
      console.log(error)
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });



    if (existingUser) {
      console.log("existing user")
      return res.status(400).json({ message: "That email is already in use." });
    }




    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: "ATTENDANT",
      isVerified: false,
    });

    const user_token_object = user.get({ plain: true });
    delete user_token_object.password; // Remove password field for safety

    // Generate JWT
    const token = jwt.sign(user_token_object, process.env.JWT, {
      expiresIn: "1h",
    });

    return res.status(201).json({ token, message: "Success." });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
