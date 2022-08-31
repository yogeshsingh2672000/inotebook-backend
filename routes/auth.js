const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "ThisIsUsedToSignTheJwtToken";

// Create user using: POST "/api/auth/createuser". no login required
router.post(
  "/createuser",
  [
    body("name", "Name must be 2 character long").isLength({
      min: 3,
    }),
    body("email", "Please enter a valid Email").isEmail(),
    body("password", "Password must be 5 character long").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // validating user already exist or not
      let user = await User.findOne({ email: req.body.email });

      // if user exist the return err
      if (user != null) {
        return res.json({
          error: `user with ${user.email} email already exist`,
        });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //creating new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
      //   res.json({ user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

module.exports = router;
