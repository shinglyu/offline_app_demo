function changeLoadingVisibility(isVisiable){
  //true: turn on loading img
  if(isVisiable){
    document.getElementById('loadingImg').className ='';
  }
  else{
    document.getElementById('loadingImg').className ='hidden';
  }
}

function glow(){
  //make the window glow!
    document.getElementById('glower').className ='glow';
    setTimeout(function(){
      document.getElementById('glower').className ='';
        
    }, 2000)
}

function parseTime(data){
  var t = data['mday'];
                 
  return new Date(t.substr(0,4), t.substr(4, 2)-1, t.substr(6, 2), 
                  t.substr(8, 2), t.substr(10, 2), t.substr(12, 2));
                  
}

function updatePage(data){
  //update the page content, also glow the window once
  function updateField(id){ document.getElementById(id).innerHTML= data[id];
  }

  glow();

  updateField('sna');
  //updateField('ar');
  updateField('sbi');
  updateField('bemp');
  document.getElementById('lastupdate').innerHTML = parseTime(data).toLocaleString();

}

function downloadUbikeStatus(callback){
  //Get the current ubike status via AJAX
  changeLoadingVisibility(true);
  console.log("downloading...")
  var url = 'http://opendata.dot.taipei.gov.tw/opendata/gwjs_cityhall.json'
  var onSuccess = function(){
    firstEntry = request.response.retVal[0]
    callback(firstEntry)
    localforage.setItem('data', firstEntry, function(){})
    changeLoadingVisibility(false);
  }
  
  //Notice the mozSystem: true flag
  var request = new XMLHttpRequest({ mozSystem: true });
  request.open('get', url, true);
  request.responseType = 'json';
  request.addEventListener('error', function(){console.log(request.error)});
  request.addEventListener('load', onSuccess);
  request.send();
}

function main(){
  //Try load from local db first
  localforage.getItem('data', function(data){ 
      console.log('load from db')
      updatePage(data); 
      changeLoadingVisibility(false);
  })
  //Try download latest status immediately
  downloadUbikeStatus(updatePage)
  //Try download latest status every intv ms
  var intv = 0.5 * 60 * 1000;
  //var intv = 1 * 60 * 1000;
  var timerId = setInterval(function(){downloadUbikeStatus(updatePage);}, intv);
  //You can cancel the timer by clearInterval(timerId)
  console.log("TimerId: " + timerId);
}

window.onload = main

