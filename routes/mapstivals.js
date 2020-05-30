const express = require("express");
const router = express.Router();
const models = require("../models");
const convert = require("xml-js");
const API = require("../config/apikey");
const axios = require("axios");

const API_KEY = API.API_KEY;
const API_URL = API.API_URL;
const API_ETC = API.API_ETC;

let startDate = "20200501";
let SEARCH_URL = `${API_URL}searchFestival?serviceKey=${API_KEY}${API_ETC}&listYN=Y&eventStartDate=${startDate}`;

//축제 메인페이지
router.get("/main", function (req, res, next) {
  axios
    .get(`${SEARCH_URL}`)
    .then((response) => {
      const tourData = [];
      for (i = 0; i < 10; i++) {
        tourData.push(response.data.response.body.items.item[i]);
        // console.log(tourData[i]);
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

  this.startDate = startDate;
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
router.post("/detail", function (req, res, next) {
  let setting = req.body;
  let value = "";

  for (const key in setting) {
    value = key;

    // console.log(value);
  }
  let INFO_URL = `${API_URL}detailCommon?ServiceKey=${API_KEY}&contentId=${value}${API_ETC}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y`;

  axios
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
  let URL = `${API_URL}searchFestival?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=mapstival&listYN=Y&areaCode=${f_area}&eventStartDate=${startDate}`;
  return URL;
}

// async function httpRequest() {
//   try {
//     // url += queryParams;
//     const URL = URL;
//     const response = await axios.get(URL);
//     xml = convert.xml2json(response, { compact: true, spaces: 4 });
//     xml = JSON.parse(xml);
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function getUser() {
//   try {
//     // url += queryParams;
//     const response = await axios.get(URL);
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// }

// function axiosTest() {
//   // var strr = [];
//   URL += queryParams;
//   axios
//     .get(URL)
//     .then(function (response) {
//       (response) => response;
//     })

//     .catch(function (error) {
//       console.log(error);
//     });
//   return response;
// }

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
