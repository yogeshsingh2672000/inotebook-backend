const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get(
  "/task",
  fetchuser,
  [
    body("input1", "input1 should be a number").isNumeric(),
    body("input2", "input1 should be a number").isNumeric(),
  ],
  (req, res) => {
    let { input1, input2 } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    function fabonacci(input1, input2) {
      res = [];
      for (let i = 0; i < 7; i++) {
        res.push(input1);
        nth = input1 + input2;
        input1 = input2;
        input2 = nth;
      }
      return res;
    }

    return res.json(fabonacci(input1, input2));
  }
);
module.exports = router;
