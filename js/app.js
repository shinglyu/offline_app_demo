var lastupdate = ''
function updatePage(data){
  function updateField(id){ document.getElementById(id).innerHTML= data[id];
  }
  updateField('sna');
  //updateField('ar');
  updateField('sbi');
  updateField('bemp');
  document.getElementById('lastupdate').innerHTML = parseTime(data).toLocaleString();

}
/*
function downloadUbikeStatus(callback){
  console.log("downloading...")
  var url = 'http://opendata.dot.taipei.gov.tw/opendata/gwjs_cityhall.json'
  var onSuccess = function(data){
    //console.log(JSON.parse(data));
    //console.log(data.retVal);
    firstEntry = data.retVal[0]
    callback(firstEntry)
    localforage.setItem('data', firstEntry, function(){})
    lastupdate = (new Date()).toLocaleString();
    localforage.setItem('lastupdate', lastupdate, function(){})
  }
  $.ajax({
    dataType: "jsonp",
    url: 'http://jsonp.guffa.com/Proxy.ashx?url=' + url,
    success: onSuccess
  });
}
*/

function downloadUbikeStatus(callback){
  console.log("downloading...")
  var url = 'http://opendata.dot.taipei.gov.tw/opendata/gwjs_cityhall.json'
  var onSuccess = function(){
    //console.log(JSON.parse(data));
    console.log(request)
    firstEntry = request.response.retVal[0]
    callback(firstEntry)
    localforage.setItem('data', firstEntry, function(){})
    //lastupdate = (new Date()).toLocaleString();
    lastupdate = parseTime(firstEntry).toLocaleString();
    localforage.setItem('lastupdate', lastupdate, function(){})
  }
  
  var request = new XMLHttpRequest({ mozSystem: true });
  //request = new XMLHttpRequest();
  request.open('get', url, true);
  request.responseType = 'json';
  request.addEventListener('error', function(){alert(request.error)});
  request.addEventListener('load', onSuccess);
  request.send();
}
function main(){
  //var timerId = setInterval(downloadUbikeStatus(updatePage), intv)
  //Try load from local db first
  localforage.getItem('lastupdate', function(localLastUpdate){ 
      lastupdate = localLastUpdate;
  })
  localforage.getItem('data', function(data){ 
      console.log('load from db')
      updatePage(data); 
  })
  //Try download latest status immediately
  downloadUbikeStatus(updatePage)
  //Try download latest status every intv ms
  var intv = 0.1 * 60 * 1000;
  //var intv = 1 * 60 * 1000;
  var timerId = setInterval(function(){downloadUbikeStatus(updatePage);}, intv);
  console.log("TimerId: " + timerId);
}
function parseTime(data){
  var t = data['mday'];
                 
  return new Date(t.substr(0,4), t.substr(4, 2)-1, t.substr(6, 2), 
                  t.substr(8, 2), t.substr(10, 2), t.substr(12, 2));
                  
}

window.onload = main

