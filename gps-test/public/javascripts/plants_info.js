// google map api-key
//AIzaSyBq8ld3uWrAFvsJ6VMymFFABbC4Se6UtDQ
$(function ()　{
    'use strict';
  // 初期化
  plants_info.getInfo("00000000d8099b6a");
  setTimeout(plants_info.timeup,10000);
});

var plants_info = plants_info || {};

plants_info.timeup = function() {
    plants_info.getInfo("00000000d8099b6a");
    setTimeout(plants_info.timeup,10000);
};
plants_info.getInfo = function(serialno) {
  var req_url = "/moist_get?serialno=" + serialno;
  var info = {temperature: 0.00, humidity: 0.00,moist_1:0.0,moist_2:0.0};
  $.get(req_url,function(response) {
      for(var i = 0;i < response.records;i++) {
        var row = response.rows[i].cell;
        info.temperature = row.temperature;
        info.humidity = row.humidity;
        info.moist_1 = row.moist_1;
        info.moist_2 = row.moist_2;
        info.date = row.uploadtime;
      }
      // TEST
      //info.lat += 0.3337;
      //info.lng += 0.0437;
      //
      var d = new Date(info.date);
      d = plants_info.getDateString(d, "{0}-{1}-{2}") + " " + plants_info.getTimeString(d,"{0}:{1}:{2}");
      $("#date").text(d);
      $("#temperature").text(info.temperature);
      $("#humidity").text(info.humidity);
      $("#moist_1").text(info.moist_1);
      $("#moist_2").text(info.moist_2);
  });

}

plants_info.getDateString = function (date, format_str) {
	var date_format = plants_info.format(format_str,
			date.getFullYear(),
			date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
		    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
	);
	return date_format;
};
plants_info.getTimeString = function (date, format_str) {
	var date_format = plants_info.format(format_str,
			date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
	);
	return date_format;
};
plants_info.format = function (fmt, a) {
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
