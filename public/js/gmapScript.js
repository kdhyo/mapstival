var latdata = "";
var equdata = "";
var lat = "";
var equ = "";

const neighborhoods = [];

for (i = 0; i <= lat.length; i++) {
  neighborhoods.push({ lat: parseFloat(lat[i]), lng: parseFloat(equ[i]) });
}

var markers = [];
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 37.39995, lng: 126.923585 },
  });
}

function dataIn(lat, equ) {
  latdata = lat;
  equdata = equ;
  lat = latdata.split(",").map(Number);
  equ = equdata.split(",").map(Number);

  for (i = 0; i <= lat.length; i++) {
    neighborhoods.push({ lat: parseFloat(lat[i]), lng: parseFloat(equ[i]) });
  }
  drop();
}

function drop() {
  clearMarkers();
  for (var i = 0; i < neighborhoods.length; i++) {
    addMarkerWithTimeout(neighborhoods[i], i * 100); // i*숫자로 마커들 떨어지는 속도 조절
  }
}

var image = "../images/flower.gif";
function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function () {
    markers.push(
      new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "hello", //마커에 마우스 대면 이름뜨게
        icon: image,
      })
    );
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}
