const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", function (req, res, next) {
  res.render("map/map");
});

module.exports = router;
