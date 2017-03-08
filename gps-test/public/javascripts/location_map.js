// google map api-key
//AIzaSyBq8ld3uWrAFvsJ6VMymFFABbC4Se6UtDQ
$(function ()　{
    'use strict';
  // 初期化
  location_map.getLocation("1234")
});

var location_map = location_map || {};

location_map.initMap = function(lat_lng) {
    // Create a map object and specify the DOM element for display.
    var myLatLng = {lat: 37.8347, lng: 139.1092};
    var map = new google.maps.Map(document.getElementById('map'), {
     center: lat_lng,
     scrollwheel: false,
     zoom: 17
    });
    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: lat_lng,
      title: 'Car No.1'
    });
};

location_map.getLocation = function(serialno) {
  var req_url = "/location_get?serialno=" + serialno;
  var lat_lng = {lat: 37.8347, lng: 139.1092};
  $.get(req_url,function(response) {
      for(var i = 0;i < response.records;i++) {
        var row = response.rows[i].cell;
        lat_lng.lat = Number(row.latitude);
        lat_lng.lng = Number(row.longitude);
      }
      location_map.initMap(lat_lng);
  });

}
