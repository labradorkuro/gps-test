//
//
//
var date_lib = require('./date_lib');

var plants_moist = models['plants_moist'];

exports.plants_moist_post = function(req, res) {
  plants_tbl.save(req, res);
}

exports.plants_moist_get = function(req, res) {
  plants_tbl.get(req, res);
}

var plants_tbl = plants_tbl || {}

plants_tbl.get = function(req, res) {
  var result = { page: 1, total: 1, records: 0, rows: [] };
  var serialno = req.query.serialno;
  var date = date_lib.getToday("{0}-{1}-{2}");
  var attr = {where:{serialno:serialno},order:[['uploadtime','desc']]};
  plants_moist.schema('location_system').find(attr).then(function(plants){

    for(var i in location) {
      var row = { id: '', cell: [] };
      row.id = location[i].id;
      row.cell = location[i];
      result.rows.push(row);
    }
    res.send(result);
  }).catch(function(error){
    console.log(error);
    res.send("");
  });
}

//　データ保存処理
plants_tbl.save = function(req, res) {
  plants = req.body;
  plants.moist_1 = Number(plants.moist_1);
  plants.moist_2 = Number(plants.moist_2);
  plants.temperature = Number(plants.temperature);
  plants.humidity = Number(plants.humidity);
  var attr = {where:{id:plants.id}};
  console.log("save");
  // 検索
  plants.schema('location_system').find(attr).then(function(data){
    if (data) {
      // 更新
      attr = {serialno:plants.serialno,moist_1:plants.moist_1,moist_2:plants.moist_2,temperature:plants.temperature,humidity:plants.humidity};
      plants_moist.schema('location_system').update(attr,{where:{id:req.body.location_id}}).then(function(result) {
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
      attr = {serialno:plants.serialno,moist_1:plants.moist_1,moist_2:plants.moist_2,temperature:plants.temperature,humidity:plants.humidity};
      var si = plants_moist.schema('location_system').build(attr);
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
