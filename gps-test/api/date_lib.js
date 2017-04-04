var date_lib = date_lib || {}

// 日付処理
date_lib.getToday = function (format_str) {
	var d = new Date();
	return date_lib.getDateString(d, format_str) + " " + date_lib.getTimeString(d,"{0}:{1}:00");
};
date_lib.getDateString = function (date, format_str) {
	var date_format = date_lib.format(format_str,
			date.getFullYear(),
			date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
		    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
	);
	return date_format;
};
date_lib.getTimeString = function (date, format_str) {
	var date_format = date_lib.format(format_str,
			date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
			date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	);
	return date_format;
};
date_lib.format = function (fmt, a) {
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
