const express = require("express");
const router = express.Router();
const models = require("../models");
const board = models.Board;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const API = require("../config/apikey");
const axios = require("axios");
const GAPI = require("../config/gapikey.json");
const naverid = require("../config/naverKey.json");
const naversecret = require("../config/naverKey.json");

// API key 선언
const client_id = naverid.client_id;
const client_secret = naversecret.client_secret;
const GAPI_KEY = GAPI.GAPI_KEY;
const API_KEY = API.API_KEY;
const API_URL = API.API_URL;
const API_ETC = API.API_ETC;

let INFO_URL = null;
let URL = null;
let tourData = [];
let FNumber = 6;
let hidden = "";

// 맵 초기값 셋팅
let startYear = 2020;
let startMonth = 05;
let startDate = 20200501;
let f_area = 1;
let selected = [];

let reference = null;
let rating = null;
let ratingPutNumber = null;
let gmapx = null;
let gmapy = null;
let gtitle = null;

//축제 메인페이지
router.get("/", function (req, res, next) {
  f_area = req.query.f_area;

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
    startDate = startYear + startMonth + "01";
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

  console.log(startDate);

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
      } else if (response.data.response.body.items == "") {
        console.log("첫번째 if");
        tourData = "";
      } else {
        tourData.push(list);
      }
      if (tourData.length < FNumber) {
        hidden = "ok";
      }
      console.log(`투어데이터는? ${tourData}`);
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

// router.get('/blog', async (req, res) => {
//   var api_url = 'https://openapi.naver.com/v1/search/blog.json?query=' + encodeURI('안녕')+'&display=5'; // json 결과
//   //  var options = {
//   //      url: api_url,
//   //      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//   //   };
//   var config ={
//     headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//   }

//     try {
//       const options =  await axios.get(api_url, config);
//       console.log(options.data.items[0].title)
//     } catch (error) {
//       console.log(`에러${error}`)
//     }
// });

//상세정보 페이지 이동
//비동기 처리방식
router.get("/detail", async function (req, res, next) {
  let setting = req.body;
  let value = "";

  value = req.query.id;

  INFO_URL = `${API_URL}detailCommon?ServiceKey=${API_KEY}&contentId=${value}${API_ETC}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&mapinfoYN=Y`;
  let DETAIL_URL = `${API_URL}detailIntro?ServiceKey=${API_KEY}${API_ETC}&contentId=${value}&contentTypeId=15`;
  let tourData = null;
  let detail_Data = null;

  try {
    const INFO = await axios.get(INFO_URL);
    const DETAIL = await axios.get(DETAIL_URL);

    //db 데이터 가져오기
    const dbData = await board.findAll({
      where: {
        festival_id: {
          [Op.like]: value,
        },
      },
    });

    tourData = INFO.data.response.body.items.item;
    detail_Data = DETAIL.data.response.body.items.item;
    gmapx = tourData.mapx;
    gmapy = tourData.mapy;
    gtitle = tourData.title;

    //네이버 API
    var blogData = "";
    var api_url =
      "https://openapi.naver.com/v1/search/blog.json?query=" +
      encodeURI(gtitle) +
      "&display=6"; // json 결과
    var config = {
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    };
    try {
      const options = await axios.get(api_url, config);
      blogData = options.data.items;
      console.log(blogData); //blogData[1].title 하면 제목 가져올 수 있음.
    } catch (error) {
      console.log(`에러${error}`);
    }
    //구글 평점 리뷰 가져오기
    getResponse(() => {
      res.render("mapstival/detail", {
        blogData: blogData,
        data: tourData,
        detail: detail_Data,
        rating: rating,
        ratingPutNumber: ratingPutNumber,
        dbData: dbData,
      });
    });
  } catch (err) {
    res.send(err);
  }
});

function getResponse(callback) {
  var reviewName = encodeURI(gtitle); //리뷰 검색 키워드
  var reviewlat = gmapx; // 리뷰 적도
  var reviewequ = gmapy; //리뷰 위도

  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/search/json?location=${reviewequ},${reviewlat}&radius=500&types=point_of_interest&name=${reviewName}&sensor=false&key=${GAPI_KEY}`
    )
    .then((response) => {
      console.log(response.data.status);
      if (response.data.status == "OK") {
        console.log(response.data.results[0].name);
        reference = response.data.results[0].reference;
        console.log("reference : " + reference);

        axios
          .get(
            `https://maps.googleapis.com/maps/api/place/details/json?reference=${reference}&sensor=false&key=${GAPI_KEY}`
          )
          .then((response) => {
            // for (i = 0; i < 10; i++) {
            //   tourData.push(response.data.response.body.items.item[i]);
            // }
            rating = response.data.result.rating;
            ratingPutNumber = response.data.result.user_ratings_total;

            callback(null);
          });
      } else {
        rating = "";
        ratingPutNumber = "";
        reference = "";

        return callback(null);
      }
    });
}
// 지도페이지 이동
const lat = [];
const equ = [];
const id = [];
const gmapTitle = [];
const gmapUrl = [];
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
        gmapTitle.push(tourData[i].title);
        gmapUrl.push(tourData[i].mapx);
        id.push(tourData[i].contentid);
      }
      res.render("mapstival/gmap", {
        lat: lat,
        equ: equ,
        f_area: f_area,
        gmapTitle: gmapTitle,
        tourData: tourData,
        id: id,
      });
      lat.length = 0;
      equ.length = 0;
      gmapTitle.length = 0;
      id.length = 0;
    })
    .catch((e) => {
      res.send(e);
    });
});

// 행사 날짜 설정
function apiSetting(startDate, f_area, FNumber) {
  URL = `${API_URL}searchFestival?serviceKey=${API_KEY}${API_ETC}&listYN=Y&areaCode=${f_area}&pageNo=1&numOfRows=${FNumber}&eventEndDate=${startDate}`;
  return URL;
}

module.exports = router;
