const express = require("express");
const router = express.Router();
const GAPI = require("../config/gapikey.json");
const axios = require("axios");


const GAPI_KEY = GAPI.GAPI_KEY;
const lat = [];
const equ = [];

//축제 메인페이지
router.get("/", function (req, res, next) {

    //위도 경도 넣는곳
    for (i = 0; i < 10; i++) {
        lat.push(37.395+i/1000);
        equ.push(126.915+i/500);
    }
    res.render("mapstival/gmap", { lat: lat, equ:equ});
    lat.length = 0;
    equ.length = 0;
});

router.get("/review", function (req, res, next) {
    axios
      .get(`${"https://maps.googleapis.com/maps/api/place/search/json?location=37.402201,126.922347&radius=20&types=food&sensor=false&key=AIzaSyD7lGjC1U4IAhcB7eYjAph5r0lkEfKwKuY"}`)
      .then((response) => {
        const tourData = [];
        // for (i = 0; i < 10; i++) {
        //   tourData.push(response.data.response.body.items.item[i]);
        // }
          console.log(response.data.results[2].name);
          console.log(response.data.results[2].reference);
  
        res.render("mapstival/greview", { data: tourData });
      })
      .catch((e) => {
        res.send(e);
      });
    //   axios
    //   .get(`${"https://maps.googleapis.com/maps/api/place/search/json?location=37.4020001,126.9220001&radius=20&types=food&sensor=false&key=AIzaSyD7lGjC1U4IAhcB7eYjAph5r0lkEfKwKuY"}`)
    //   .then((response) => {
    //     const tourData = [];
    //     // for (i = 0; i < 10; i++) {
    //     //   tourData.push(response.data.response.body.items.item[i]);
    //     // }
    //       console.log(response.data.results[1].name);
  
    //     res.render("mapstival/greview", { data: tourData });
    //   })
    //   .catch((e) => {
    //     res.send(e);
    //   });
  });

module.exports = router;
