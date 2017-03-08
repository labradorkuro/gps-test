// post-test
$(function ()　{
    'use strict';
  // 初期化
  $("#send_button").bind('click',locationMaster.save);
});

var locationMaster = locationMaster || {}

locationMaster.save = function() {
  var url = "/location_post";
	// フォームからデータを取得
	var form = new FormData(document.querySelector("#locationMasterForm"));
  if (!$("#delete_check").prop("checked") ){
    form.append("delete_check", '0');
  }
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.responseType = 'json';
	xhr.onload = locationMaster.onSaveMaster;
	xhr.send(form);
  return true;
}

locationMaster.onSaveMaster = function(event) {
  if (this.status == 200) {
		// success
	}
}
