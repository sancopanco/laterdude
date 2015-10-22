
var addBtn = document.getElementById("btn_read_later");
var links = document.getElementById("links");
var tabAlreadySaved = false
var btnText = "" 
var btnObj = null

$(document).on('click','.btn-time',function(e){
  //console.log(e)
  console.log($(this).text())
  btnObj =  $(this)
  btnText = $(this).text()
  storage.get(timeDefaults, function(items){
    var notify_at = getNotifyAt(items, btnText)
    addLink2Stoage(notify_at)
  })
})
function addLink2Stoage(notify_at){
  chrome.tabs.getSelected(null, function(tab){

    var newLink = {"title": tab.title,
     "timestamp": moment().valueOf(),
     "notify_at":notify_at,
     "btn-text":btnText
    }
    if (newLink.title.length > 50){
      newLink.title = newLink.title.substr(0, 50) + "..."
    }
    storage.get(tab.url, function(items){
      console.log(items);
      var item = {};
      item[tab.url] = newLink;
      storage.set(item, function(){
        console.log("item seted",item)
        $(".btn-time").css({'color':'white'})
        btnObj.css({'color':'red'})
        if(!tabAlreadySaved){
          incrementLinksCountBadge()
        }
        window.close();
      });
    })

  })
}




$(document).on('click','#open-background-page',function(e){
  chrome.runtime.sendMessage({ action: 'openbackgroundpage'}, function (res) {
      if (res === 'ok') {
        window.close();
      }
   });
})

$(document).on('click','#optionsButton',function(e){
  $(".btn-tools").toggle()
})

$(document).on('click','#save-changing-set',function(e){
  console.log("save-changeing")
  saveOptions()
})

function setTimeOptions(){
  chrome.storage.sync.set({
    toNight: tonight,
    morning: morning,
    weekend: weekend
  }, function() {
   console.log("saved")
  });
}




function saveOptions() {
  var tonight = document.getElementById('time-tonight').value;
  var morning = document.getElementById('time-morning').value;
  var weekend = document.getElementById('time-weekend').value;

  chrome.storage.sync.set({
    toNight: tonight,
    morning: morning,
    weekend: weekend
  }, function() {
    
     console.log("saved")
     $("#save-changing-set").text("Saved").css({color:'green'})
     setTimeout(function() {
      $("#save-changing-set").text("Save").css({color:'white'})
     }, 750);
     restoreOptions()
     console.log("seting new alarms")
     chrome.runtime.sendMessage({ action: 'set-alarms'}, function (res) {
      if (res === 'ok') {
        console.log("seted alarms")
      }
     });
  });
}

function restoreOptions() {
  chrome.storage.sync.get(timeDefaults, function(items) {
    console.log(items)
    $("#time-tonight").val(items["toNight"])
    $("#time-weekend").val(items["weekend"])
    $("#time-morning").val(items["morning"])
  });
}


function checkTabIfSelected(tab){
  storage.get(tab.url, function(items){
    if(Object.keys(items).length > 0){
      tabAlreadySaved = true
      setTabAlreadySaved()
    }
  })
}

function setTabAlreadySaved(){
  $("#btn_tonight").css({'color':'red'})
}



$(function(){
  console.log("popup-onload")
  chrome.tabs.getSelected(null,function(tab){
     checkTabIfSelected(tab)
  })
  console.log("restoreOptions")
  restoreOptions()
})



