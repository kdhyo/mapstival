const express = require("express");
const router = express.Router();
const GAPI = require("../config/gapikey.json");
const axios = require("axios");
const async = require("async");

const GAPI_KEY = GAPI.GAPI_KEY;
const lat = []; //적도
const equ = []; //위도

const reference = [];
const rating = [];
const ratingPutNumber = [];


//축제 메인페이지
router.get("/", function (req, res, next) {

  //위도 경도 넣는곳
  for (i = 0; i < 10; i++) {
    lat.push(37.395 + i / 1000);
    equ.push(126.915 + i / 500);
  }
  res.render("mapstival/gmap", { lat: lat, equ: equ });
  lat.length = 0;
  equ.length = 0;
});

router.get("/greview", function (req, res, next) {

  getResponse(() => {
    res.render("mapstival/greview", { rating: rating, ratingPutNumber: ratingPutNumber });
  });

});


// 함수호출로 처리하는 방식
function getResponse(callback) {
  var reviewName = encodeURI("고양국제꽃박람회"); //리뷰 검색 키워드
  var reviewlat = 37.658397 // 리뷰 적도
  var reviewequ = 126.764224 //리뷰 위도
  axios
    .get(`https://maps.googleapis.com/maps/api/place/search/json?location=${reviewlat},${reviewequ}&radius=500&types=point_of_interest&name=${reviewName}&sensor=false&key=${GAPI_KEY}`)
    .then((response) => {
      console.log(response.data.results[0].name);
      reference.push(response.data.results[0].reference);
      console.log(response.data.results[0].reference);
      reference.length = 1;
      axios
        .get(`https://maps.googleapis.com/maps/api/place/details/json?reference=${reference}&sensor=false&key=${GAPI_KEY}`)
        .then((response) => {
          // for (i = 0; i < 10; i++) {
          //   tourData.push(response.data.response.body.items.item[i]);
          // }
          rating.push(response.data.result.rating);
          rating.length = 1;
          ratingPutNumber.push(response.data.result.user_ratings_total);
          ratingPutNumber.length = 1;

          callback(null);
        });
    })
    .catch((e) => {
      res.send(e);
    });
}



module.exports = router;
