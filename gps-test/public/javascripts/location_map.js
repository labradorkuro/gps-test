// google map api-key
//AIzaSyBq8ld3uWrAFvsJ6VMymFFABbC4Se6UtDQ
$(function ()　{
    'use strict';
  // 初期化
  location_map.getLocation("00000000f94084a4")
  setTimeout("location_map.timeup()",10000);
});

var location_map = location_map || {};
location_map.timeup = function() {
    location_map.getLocation("00000000f94084a4")
};
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
location_map.exchange = function(val) {
  var v = val.split('.');
  var dd = parseFloat(v[0]);
  var mm = parseFloat(v[1]) / 60 / 10000;
  var rtn =  dd + mm;
  return rtn;
}
location_map.getLocation = function(serialno) {
  var req_url = "/location_get?serialno=" + serialno;
  var lat_lng = {lat: 37.8347, lng: 139.1092,utc:"",date:""};
  $.get(req_url,function(response) {
      for(var i = 0;i < response.records;i++) {
        var row = response.rows[i].cell;
        lat_lng.lat = location_map.exchange(row.latitude);
        lat_lng.lng = location_map.exchange(row.longitude);
        lat_lng.altitude = row.altitude;
        lat_lng.utc = row.utc;
        lat_lng.date = row.uploadtime;
      }
      // TEST
      //lat_lng.lat += 0.3337;
      //lat_lng.lng += 0.0437;
      //
      var d = new Date(lat_lng.date);
      d = location_map.getDateString(d, "{0}-{1}-{2}") + " " + location_map.getTimeString(d,"{0}:{1}:{2}");
      $("#date").text(d);
      $("#lat").text(lat_lng.lat);
      $("#lng").text(lat_lng.lng);
      $("#alt").text(lat_lng.altitude);
      $("#utc").text(lat_lng.utc);
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
