const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user using: POST "/api/auth". does'nt require authentication
router.post("/", (req, res) => {
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.send(req.body);
});

module.exports = router;
