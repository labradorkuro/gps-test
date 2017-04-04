//
//
//
var date_lib = require('date_lib');

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
  var date = date_lib.getToday("{0}-{1}-{2}");
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

//　データ保存処理
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
        longitude:req.body.longitude,altitude:req.body.altitude,utc:req.body.utc};
      location.schema('location_system').update(attr,{where:{id:req.body.location_id}}).then(function(result) {
        attr.status = "OK";
        attr.int = 60;
        res.send(attr);
      }).catch(function(error){
        console.log(error);
        attr.status = "NG";
        attr.int = 60;
        res.send(attr);
      });

    } else {
      // 新規登録
      attr = {serialno:req.body.serialno,latitude:req.body.latitude,
        longitude:req.body.longitude,altitude:req.body.altitude,utc:req.body.utc};
      console.log("serialno:" + req.body.serialno);
      var si = location.schema('location_system').build(attr);
      si.save().then(function(result) {
        attr.status = "OK";
        attr.int = 60;
        res.send(attr);
      }).catch(function(error){
        console.log(error);
        attr.status = "NG";
        attr.int = 60;
        res.send(attr);
      });
    }
  }).catch(function(error){
    console.log(error);
    attr.status = "NG";
    attr.int = 60;
    res.send("");
  });
}
