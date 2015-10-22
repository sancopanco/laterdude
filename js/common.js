var timeDefaults = {
    toNight: '20:00',
    morning: '09:00',
    weekend: '11:00'
}

var dictForBtnTime = {
  "TONIGHT":"toNight",
  "WEEKEND":"weekend",
  "MORNING": "morning"
}

var storage = chrome.storage.sync


function getNotifyAt(items,btnText){
  var notify_at_str = items[dictForBtnTime[btnText]]
  console.log("notify_at_str",notify_at_str)
  var hour  = notify_at_str.split(":")[0]
  var minute = notify_at_str.split(":")[1]
  var timeObj = {hour:hour, minute:minute}
  var notify_at = moment(timeObj).valueOf()
  if(btnText == "TONIGHT"){
    if(moment().valueOf() > notify_at){
        notify_at = moment(timeObj).add(1,'days').valueOf()
    }
  }
  else if(btnText == "MORNING"){
    if(moment().valueOf() > notify_at ){
        notify_at = moment(timeObj).add(1,'days').valueOf()
    }
  }
  else if(btnText == "WEEKEND"){
    notify_at = moment(timeObj).day(6).valueOf()
  }
  return notify_at
}


function incrementLinksCountBadge() {
  chrome.browserAction.getBadgeText({}, function(result) { 
    result++;
    chrome.browserAction.setBadgeText({text: '' + result});
  });
}


function createNotification(message){
   chrome.notifications.create({
     type: "basic",
     title: "LaterDude",
     iconUrl: "icons/icon48.png",
     message: message
  });
}



function printAllStorageItems(){
	chrome.storage.sync.get(function(items){console.log(items)})
}

function clearAll(){
	chrome.storage.sync.clear()
}

function printTimeDefauls(){
	chrome.storage.sync.get(timeDefaults, function(items) {
		console.log(items)
	})
}
function printAllAlarms(){
 chrome.alarms.getAll(function(alarms){console.log(alarms)})  
}



/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {}
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname] }
    return obj3
}

