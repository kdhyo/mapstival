const express = require("express");
const router = express.Router();
const mysql = require("mysql"); // mysql 모듈 require
const models = require("../models");

//로그인 GET
router.get("/", function (req, res) {
  res.render("index");
});

module.exports = router;
