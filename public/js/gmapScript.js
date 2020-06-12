var latdata = "";
var equdata = "";
var lat = "";
var equ = "";
var map_area = ""; //도시 위치
//메인 줌 위치 크기
var mainX = "";
var mainY = "";
var mainZoom = "";
var gmapTitle = "";
var contentid = "";

const neighborhoods = [];

var markers = [];
var map;

function dataIn(lat, equ, f_area, gmapTitle, contentid) {
  latdata = lat;
  equdata = equ;
  map_area = f_area;
  title = gmapTitle;
  id = contentid;
  lat = latdata.split(",").map(Number);
  equ = equdata.split(",").map(Number);
  contentid = id.split(",").map(Number);
  gmapTitle = title.split(",").map(String);
  for (i = 0; i <= lat.length - 1; i++) {
    neighborhoods.push({ lat: parseFloat(lat[i]), lng: parseFloat(equ[i]) });
  }
  mapArea(map_area);
  drop(gmapTitle, contentid);
}

function mapArea(map_area) {
  //지역별 좌표, 줌값 설정(스위치문)
  switch (map_area) {
    case "": //전국
      mainZoom = 6;
      mainX = 36.465195;
      mainY = 127.863747;
      break;
    case "1": //서울
      mainZoom = 11;
      mainX = 37.551556;
      mainY = 126.990861;
      break;
    case "2": //인천
      mainZoom = 10;
      mainX = 37.5702;
      mainY = 126.633742;
      break;
    case "3": //대전
      mainZoom = 11;
      mainX = 36.346959;
      mainY = 127.392177;
      break;
    case "4": //대구
      mainZoom = 11;
      mainX = 35.854728;
      mainY = 128.566214;
      break;
    case "5": //광주
      mainZoom = 11;
      mainX = 35.15318;
      mainY = 126.840166;
      break;
    case "6": //부산
      mainZoom = 11;
      mainX = 35.181779;
      mainY = 129.059329;
      break;
    case "7": //울산
      mainZoom = 11;
      mainX = 35.543268;
      mainY = 129.284248;
      break;
    case "8": //세종
      mainZoom = 11;
      mainX = 36.586154;
      mainY = 127.246597;
      break;
    case "31": //경기
      mainZoom = 9;
      mainX = 37.512633;
      mainY = 127.234031;
      break;
    case "32": //강원
      mainZoom = 8.1;
      mainX = 37.770767;
      mainY = 128.43325;
      break;
    case "33": //충북
      mainZoom = 8.5;
      mainX = 36.654629;
      mainY = 127.926352;
      break;
    case "34": //충남
      mainZoom = 8.5;
      mainX = 36.513964;
      mainY = 126.9365;
      break;
    case "35": //경북
      mainZoom = 8;
      mainX = 36.359974;
      mainY = 128.694732;
      break;
    case "36": //경남
      mainZoom = 8.8;
      mainX = 35.340135;
      mainY = 128.413596;
      break;
    case "37": //전북
      mainZoom = 9;
      mainX = 35.752749;
      mainY = 127.165214;
      break;
    case "38": //전남
      mainZoom = 8.6;
      mainX = 34.895643;
      mainY = 126.890437;
      break;
    case "39": //제주
      mainZoom = 9.8;
      mainX = 33.382609;
      mainY = 126.55583;
      break;
    default:
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: parseFloat(mainZoom),
    center: { lat: parseFloat(mainX), lng: parseFloat(mainY) },
  });
}

async function drop(gmapTitle, contentid) {
  clearMarkers();
  window.setTimeout(function () {
    for (i = 0; i < neighborhoods.length; i++) {
      addMarkerWithTimeout(
        neighborhoods[i],
        i * 150,
        gmapTitle[i],
        i,
        contentid
      ); // 'neighborhoods[i]' 는 적도 위도값, 'i * 100' 는 마커들 떨어지는 속도 조절, 'gmapTitle[i]' 는 마커들 마우스 커서시 타이틀 보여주기
    }
  }, 500);
}

var image = "../images/flower2.png";
function addMarkerWithTimeout(position, timeout, gmapTitle, i, contentid) {
  window.setTimeout(function () {
    markers.push(
      new google.maps.Marker({
        position: position, //적도 위도
        map: map,
        animation: google.maps.Animation.DROP,
        title: gmapTitle, //마커에 마우스 대면 이름뜨게
        icon: image,
      })
    );
    google.maps.event.addListener(markers[i], "click", function () {
      window.location = "detail?id=" + contentid[i];
    });
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}
