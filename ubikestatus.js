function updatePage(data){
  function updateField(id){
    document.getElementById(id).innerHTML= data[id];
  }
  updateField('sna');
  updateField('ar');
  updateField('sbi');
  updateField('bemp');
  var time = new Date();
  document.getElementById('lastupdate').innerHTML= time.toLocaleString();

}
function downloadUbikeStatus(callback){
  console.log("downloading...")
  var url = 'http://opendata.dot.taipei.gov.tw/opendata/gwjs_cityhall.json'
  var onSuccess = function(data){
    //console.log(JSON.parse(data));
    //console.log(data.retVal);
    callback(data.retVal[0])
  }
  $.ajax({
    dataType: "jsonp",
    url: 'http://jsonp.guffa.com/Proxy.ashx?url=' + url,
    success: onSuccess
  });
}

function main(){
  var intv = 1 * 60 * 1000;
  //var timerId = setInterval(downloadUbikeStatus(updatePage), intv)
  downloadUbikeStatus(updatePage)
  var timerId = setInterval(function(){downloadUbikeStatus(updatePage);}, intv)
}

window.onload = main

