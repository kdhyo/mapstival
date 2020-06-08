const express = require("express");
const router = express.Router();
const models = require("../models");
const API = require("../config/apikey");
const axios = require("axios");

const API_KEY = API.API_KEY;
const API_URL = API.API_URL;
const API_ETC = API.API_ETC;
let INFO_URL = null;
let URL = null;
let tourData = [];
let FNumber = 6;
let hidden = "";

let startYear = 2020;
let startMonth = 05;
let startDate = 20200501;
let f_area = 1;
let selected = [];

//축제 메인페이지
router.get("/", function (req, res, next) {
  const f_area = req.query.f_area;

  const newDate = new Date();
  let Year = newDate.getFullYear();
  let Month = newDate.getMonth();
  //파라미타 값이 있으면 그걸로
  if (req.query.year != null) {
    Year = req.query.year;
  }
  if (req.query.Month != null) {
    Month = req.query.Month;
  }

  if (Month < 10) {
    Month = `0${Month}`;
  }
  const today = `${Year}${Month}01`;

  const selected = {
    Month: `${Month}`,
    Year: `${Year}`,
    f_area: `${f_area}`,
  };

  axios
    .get(`${apiSetting(today, f_area, FNumber)}`)
    .then((response) => {
      let tourData = [];
      const list = response.data.response.body.items.item;
      if (Array.isArray(list)) {
        if (list != undefined) {
          for (data in list) {
            tourData.push(list[data]);
          }
        } else {
          tourData = null;
        }
      } else if (response.data.response.body.items === "") {
        tourData = null;
      } else {
        tourData.push(list);
      }
      res.render("mapstival/main", {
        data: tourData,
        selected: selected,
        hidden: hidden,
      });
    })
    .catch((e) => {
      res.send(e);
    });
});

//축제 날짜 지역 post로 받아오기
router.post("/main", function (req, res, next) {
  console.log(req.body);
  if (req.body.startYear) {
    startYear = req.body.startYear;
    startMonth = req.body.startMonth;
    cstartDate = startYear + startMonth + "01";
    f_area = req.body.f_area;
    selected = {
      Month: `${startMonth}`,
      Year: `${startYear}`,
      f_area: `${f_area}`,
    };
    FNumber = 6;
    hidden = "";
  } else if (req.body.buttonClick) {
    MaxNumber = 6 + FNumber;
    FNumber += 6;
  }

  axios
    .get(`${apiSetting(startDate, f_area, FNumber)}`)
    .then((response) => {
      tourData = [];
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
      if (tourData.length < FNumber) {
        hidden = "ok";
      }
      console.log(`투어데이터 : ${tourData.length}`);
      res.render("mapstival/main", {
        data: tourData,
        selected: selected,
        hidden: hidden,
      });
    })
    .catch((e) => {
      res.send(e);
    });
});

//상세정보 페이지 이동
router.post("/detail", async function (req, res, next) {
  let setting = req.body;
  let value = "";
  console.log(setting);
  for (const key in setting) {
    value = key;
    console.log(`키값 가져오기 성공! : ${value}`);
  }

  INFO_URL = `${API_URL}detailCommon?ServiceKey=${API_KEY}&contentId=${value}${API_ETC}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&mapinfoYN=Y`;
  let DETAIL_URL = `${API_URL}detailIntro?ServiceKey=${API_KEY}${API_ETC}&contentId=${value}&contentTypeId=15`;
  let tourData = null;
  let detail_Data = null;

  try {
    const INFO = await axios.get(INFO_URL);
    const DETAIL = await axios.get(DETAIL_URL);
    tourData = INFO.data.response.body.items.item;
    detail_Data = DETAIL.data.response.body.items.item;
    console.log(`투어데이터 ${tourData}`);
    console.log(`디테일데이터 ${detail_Data}`);
    res.render("mapstival/detail", { data: tourData, detail: detail_Data });
  } catch (err) {
    res.send(err);
  }
});

// const infodata = async function (INFO_URL, callback) {
//   await axios
//     .get(`${INFO_URL}`)
//     .then((response) => {
//       this.tourData = response.data.response.body.items.item;
//       console.log(response.data.response.body.items);
//       callback();
//     })
//     .catch((e) => {
//       res.send(e);
//     });
// };

// const detaildata = async function (DETAIL_URL, callback) {
//   axios.get(`${DETAIL_URL}`).then((response) => {
//     this.detail_Data = response.data.response.body.items.item;
//     console.log(detail_Data);
//     callback();
//   });
// };
// 지도페이지 이동
const lat = [];
const equ = [];
router.get("/gmap", function (req, res, next) {
  axios
    .get(`${URL}`)
    .then((response) => {
      let tourData = [];
      const list = response.data.response.body.items.item;

      if (Array.isArray(list)) {
        if (list != undefined) {
          for (data in list) {
            tourData.push(list[data]);
          }
        } else {
          tourData = null;
        }
      } else if (response.data.response.body.items === "") {
        tourData = null;
      } else {
        tourData.push(list);
      }
      //위도 경도 넣는곳
      for (i = 0; i < tourData.length; i++) {
        lat.push(tourData[i].mapy);
        equ.push(tourData[i].mapx);
      }
      res.render("mapstival/gmap", { lat: lat, equ: equ });
      lat.length = 0;
      equ.length = 0;
    })
    .catch((e) => {
      res.send(e);
    });
});

// 행사 날짜 설정
function apiSetting(startDate, f_area, FNumber) {
  URL = `${API_URL}searchFestival?serviceKey=${API_KEY}${API_ETC}&listYN=Y&areaCode=${f_area}&pageNo=1&numOfRows=${FNumber}&eventStartDate=${startDate}`;
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

function pageUp() {
  pageNo++;
  URL += `&pageNo=${pageNo}`;
  axios
    .get(URL)
    .then((response) => {
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
      res.render("mapstival/main", {
        data: tourData,
        selected: selected,
      });
    })
    .catch((e) => {
      res.send(e);
    });
}

module.exports = router;
