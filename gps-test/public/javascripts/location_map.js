// google map api-key
//AIzaSyBq8ld3uWrAFvsJ6VMymFFABbC4Se6UtDQ
$(function ()　{
    'use strict';
  // 初期化
  location_map.getLocation("00000000f94084a4")
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
  var lat_lng = {lat: 37.8347, lng: 139.1092,date:""};
  $.get(req_url,function(response) {
      for(var i = 0;i < response.records;i++) {
        var row = response.rows[i].cell;
        lat_lng.lat = Number(row.latitude);
        lat_lng.lng = Number(row.longitude);
        lat_lng.date = row.uploadtime;
      }
      var d = new Date(lat_lng.date);
      d = location_map.getDateString(d, "{0}-{1}-{2}") + " " + location_map.getTimeString(d,"{0}:{1}:{2}");
      $("#date").text(d);
      location_map.initMap(lat_lng);
  });

}

location_map.getDateString = function (date, format_str) {
	var date_format = location_map.format(format_str,
			date.getFullYear(),
			date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
		    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
	);
	return date_format;
};
location_map.getTimeString = function (date, format_str) {
	var date_format = location_map.format(format_str,
			date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
	);
	return date_format;
};
location_map.format = function (fmt, a) {
	var rep_fn = undefined;

	if (typeof a == "object") {
		rep_fn = function (m, k) { return a[ k ]; }
	}
	else {
		var args = arguments;
		rep_fn = function (m, k) { return args[ parseInt(k) + 1 ]; }
	}

	return fmt.replace(/\{(\w+)\}/g, rep_fn);
};
