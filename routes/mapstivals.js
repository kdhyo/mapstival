const express = require("express");
const router = express.Router();
const models = require("../models");
const board = models.Board;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const API = require("../config/apikey");
const axios = require("axios");

// API key 선언
const GOOGLE_KEY = API.googleAPI.API_KEY;
const NAVER_ID = API.naverAPI.CLIENT_ID;
const NAVER_SECRET = API.naverAPI.CLIENT_SECRET;
const FESTIVAL_KEY = API.festivalAPI.API_KEY;
const FESTIVAL_URL = API.festivalAPI.API_URL;
const FESTIVAL_ETC = API.festivalAPI.API_ETC;

let reference = null;
let rating = null;
let ratingPutNumber = null;
let gmapx = null;
let gmapy = null;
let gtitle = null;

//한 축제데이터를 6개씩 호출할 예정
let rows = 6;

//축제 메인페이지 이동 시 초기 값 전송
router.get("/", function (req, res, next) {
  // 지역 선택 초기 값
  let area = req.query.area;
  let newDate = new Date();
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;

  const selected = {
    month: `${month}`,
    year: `${year}`,
    area: `${area}`,
  };
  res.render("mapstival/main", {
    selected,
  });
});

//축제 API 검색 POST
router.post("/search", async function (req, res, next) {
  try {
    if (req.body) {
      const area = req.body.area,
        pageNum = req.body.pageNum,
        date = req.body.date;

      let festivalData = await axios.get(
        `${FESTIVAL_URL}searchFestival?serviceKey=${FESTIVAL_KEY}${FESTIVAL_ETC}&listYN=Y&areaCode=${area}&pageNo=${pageNum}&numOfRows=${rows}&eventEndDate=${date}`
      );
      const data = festivalData.data.response.body;
      res.json(data);
    }
  } catch (err) {
    console.log(err);
  }
});

//상세정보 페이지 이동
//동기 처리방식
router.get("/detail", async function (req, res, next) {
  let value = "";

  value = req.query.id;

  INFO_URL = `${FESTIVAL_URL}detailCommon?ServiceKey=${FESTIVAL_KEY}&contentId=${value}${FESTIVAL_ETC}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&mapinfoYN=Y`;
  let DETAIL_URL = `${FESTIVAL_URL}detailIntro?ServiceKey=${FESTIVAL_KEY}${FESTIVAL_ETC}&contentId=${value}&contentTypeId=15`;
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
        "X-Naver-Client-Id": NAVER_ID,
        "X-Naver-Client-Secret": NAVER_SECRET,
      },
    };
    try {
      const options = await axios.get(api_url, config);
      blogData = options.data.items;
    } catch (error) {
      console.log(`에러${error}`);
    }
    //구글 평점 리뷰 가져오기
    getResponse(() => {
      var ratings = rating % 1;
      ratings = ratings.toFixed(1) * 10;
      rating = Math.floor(rating);

      res.render("mapstival/detail", {
        blogData: blogData,
        data: tourData,
        detail: detail_Data,
        rating: rating,
        ratings: ratings,
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
      `https://maps.googleapis.com/maps/api/place/search/json?location=${reviewequ},${reviewlat}&radius=500&types=point_of_interest&name=${reviewName}&key=${GOOGLE_KEY}`
    )
    .then((response) => {
      if (response.data.status == "OK") {
        reference = response.data.results[0].reference;

        axios
          .get(
            `https://maps.googleapis.com/maps/api/place/details/json?reference=${reference}&key=${GOOGLE_KEY}`
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

module.exports = router;
