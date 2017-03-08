//
//
//
var location = models['location'];

exports.location_post = function(req, res) {
  location_tbl.save(req, res);
}

exports.location_get = function(req, res) {
  location_tbl.get(req, res);
}

var location_tbl = location_tbl || {}

location_tbl.get = function(req, res) {
  var result = { page: 1, total: 1, records: 0, rows: [] };
  var serialno = req.query.serialno;
  var date = location_tbl.getToday("{0}-{1}-{2}");
  var attr = {where:{serialno:serialno},order:[['uploadtime','desc']]};
  location.schema('location_system').findOne(attr).then(function(location){
/*
    for(var i in location) {
      var row = { id: '', cell: [] };
      row.id = location[i].id;
      row.cell = location[i];
      result.rows.push(row);
    }
*/
    var row = { id: '', cell: [] };
    row.id = location.id;
    row.cell = location;
    result.rows.push(row);
    result.records = 1;
    res.send(result);
  }).catch(function(error){
    console.log(error);
    res.send("");
  });
}
// カレンダー
location_tbl.getToday = function (format_str) {
	var d = new Date();
	return location_tbl.getDateString(d, format_str) + " " + location_tbl.getTimeString(d,"{0}:{1}:00");
};
location_tbl.getDateString = function (date, format_str) {
	var date_format = location_tbl.format(format_str,
			date.getFullYear(),
			date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
		    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
	);
	return date_format;
};
location_tbl.getTimeString = function (date, format_str) {
	var date_format = location_tbl.format(format_str,
			date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
			date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	);
	return date_format;
};
location_tbl.format = function (fmt, a) {
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

//
location_tbl.save = function(req, res) {
  loc = req.body;
  loc.location_id = Number(loc.location_id);
  var attr = {where:{id:loc.location_id}};
  console.log("save");
  // 検索
  location.schema('location_system').find(attr).then(function(data){
    if (data) {
      // 更新
      attr = {serialno:req.body.serialno,latitude:req.body.latitude,
        longitude:req.body.longitude,altitude:req.body.altitude};
      location.schema('location_system').update(attr,{where:{id:req.body.location_id}}).then(function(result) {
        res.send(attr);
      }).catch(function(error){
        console.log(error);
        res.send(attr);
      });

    } else {
      // 新規登録
      attr = {serialno:req.body.serialno,latitude:req.body.latitude,
        longitude:req.body.longitude,altitude:req.body.altitude};
      console.log("serialno:" + req.body.serialno);
      var si = location.schema('location_system').build(attr);
      si.save().then(function(result) {
        res.send(attr);
      }).catch(function(error){
        console.log(error);
        res.send(attr);
      });
    }
  }).catch(function(error){
    console.log(error);
    res.send("");
  });
}
