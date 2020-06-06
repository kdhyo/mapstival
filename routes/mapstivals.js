const express = require("express");
const router = express.Router();
const models = require("../models");
const convert = require("xml-js");
const API = require("../config/apikey");
const axios = require("axios");

const API_KEY = API.API_KEY;
const API_URL = API.API_URL;
const API_ETC = API.API_ETC;

//축제 메인페이지
router.get("/", function (req, res, next) {
  const f_area = req.query.f_area;

  const newDate = new Date();
  let Year = `newDate.getFullYear()`;
  let Month = `newDate.getMonth()`;
  if (Month < 10) {
    Month = `0${Month}`;
  }
  const today = `${Year}${Month}01`;

  axios
    .get(`${apiSetting(today, f_area)}`)
    .then((response) => {
      let tourData = [];
      const list = response.data.response.body.items.item;
      if (Array.isArray(list)) {
        if (list != undefined) {
          for (data in list) {
            tourData.push(list[data]);
          }
        } else {
          console.log("두번째 if");
          tourData = null;
        }
      } else if (response.data.response.body.items === "") {
        console.log("첫번째 if");
        tourData = null;
      } else {
        tourData.push(list);
      }
      res.render("mapstival/main", { data: tourData });
    })
    .catch((e) => {
      res.send(e);
    });
});

//축제 날짜 지역 받아오기
router.post("/main", function (req, res, next) {
  const startYear = req.body.startYear;
  const startMonth = req.body.startMonth;
  const startDate = startYear + startMonth + "01";
  const f_area = req.body.f_area;
  axios
    .get(`${apiSetting(startDate, f_area)}`)
    .then((response) => {
      let tourData = [];
      const list = response.data.response.body.items.item;
      if (Array.isArray(list)) {
        if (list != undefined) {
          for (data in list) {
            tourData.push(list[data]);
          }
        } else {
          console.log("두번째 if");
          tourData = null;
        }
      } else if (response.data.response.body.items === "") {
        console.log("첫번째 if");
        tourData = null;
      } else {
        tourData.push(list);
      }
      // console.log(tourData);
      res.render("mapstival/main", { data: tourData });
    })
    .catch((e) => {
      res.send(e);
    });
});

//상세정보 페이지 이동
router.post("/detail", async function (req, res, next) {
  let setting = req.body;
  let value = "";
  for (const key in setting) {
    value = key;
    // console.log(value);
  }
  let INFO_URL = `${API_URL}detailCommon?ServiceKey=${API_KEY}&contentId=${value}${API_ETC}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y`;
  await axios
    .get(`${INFO_URL}`)
    .then((response) => {
      let tourData = null;
      tourData = response.data.response.body.items.item;
      // console.log(tourData);
      res.render("mapstival/detail", { data: tourData });
    })
    .catch((e) => {
      res.send(e);
    });

  // res.send(INFO_URL);
});

// 상세페이지 셋팅
function detailSetting() {
  let;
}

// 행사 날짜 설정
function apiSetting(startDate, f_area) {
  let URL = `${API_URL}searchFestival?serviceKey=${API_KEY}${API_ETC}&listYN=Y&areaCode=${f_area}&pageNo=1&numOfRows=6&eventStartDate=${startDate}`;
  return URL;
}

function getDate() {
  const date = new Date();

  let year = this.date.getFullYear(),
    month = this.date.getMonth() + 1;

  if (month >= 1 && month < 10) {
    month = "0" + month;
  }
  day = "0" + 1;
  var result = year.toString() + month.toString() + day;
  return result;
}

module.exports = router;
