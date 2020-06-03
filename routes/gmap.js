const express = require("express");
const router = express.Router();
const GAPI = require("../config/gapikey.json");
const axios = require("axios");

const GAPI_KEY = GAPI.GMAP_KEY;
const lat = [];
const equ = [];

//축제 메인페이지 하기
router.get("/main", function (req, res, next) {
  //위도 경도 넣는곳
  for (i = 0; i < 10; i++) {
    lat.push(37.4 + i / 1000);
    equ.push(126.93 + i / 1000);
  }
  res.render("mapstival/gmap", { lat: lat, equ: equ, GAPI_KEY: GAPI_KEY });
  lat.length = 0;
  equ.length = 0;
});

module.exports = router;
