const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Create user using: POST "/api/auth". does'nt require authentication
router.post(
  "/",
  [
    body("name", "Name must be 2 character long").isLength({
      min: 3,
    }),
    body("email", "Please enter a valid Email").isEmail(),
    body("password", "Password must be 5 character long").isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err.message);
        res.json({
          error: "Please enter a unique email",
          message: err.message,
        });
      });
  }
);

module.exports = router;
