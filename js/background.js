function openBackgroundPage() {
  chrome.tabs.create({ url: chrome.extension.getURL('latertab.html') });
}

chrome.runtime.onMessage.addListener(function (req, sender, sendRes) {
        switch (req.action) {
        case 'save':
            openBackgroundPage();
            sendRes('ok'); 
            break;
        case 'set-alarms':
            setAlarms();
            sendRes('ok');
            break;
        case 'openbackgroundpage':
            console.log("openbackgroundpage")
            openBackgroundPage();
            sendRes('ok'); 
            break;
        default:
            sendRes('nope');
            break;
        }
});

function onAlarm(alarm) {
    console.log("onAlarm") 
    console.log(alarm.name)
    console.log(alarm.scheduledTime)
    openBackgroundPage()
    createNotification("You have some reading list")
};


function setAlarms(){
  chrome.storage.sync.get(timeDefaults, function(items) {
    console.log("setAlarms:",items)
     var toNight = {
        hour: items['toNight'].split(":")[0],
        minute: items['toNight'].split(":")[1]
      }
      var morining = {
        hour:items['morning'].split(":")[0],
        minute:items['morning'].split(":")[1]
      }
      var weekend = {
        hour:items['weekend'].split(":")[0],
        minute:items['weekend'].split(":")[1]
      }
      console.log("toNight",toNight)
      console.log("morning",morining)
      console.log("weekend",weekend)

      var notify_at_tonight = moment(toNight).valueOf()
      var notify_at_morning = moment(morining).valueOf()
      var notify_at_weekend_1 = moment(weekend).day(6).valueOf()
      var notify_at_weekend_2 = moment(weekend).day(7).valueOf()

      if(moment().valueOf() > notify_at_tonight ){
        notify_at_tonight = moment(toNight).add(1,'days').valueOf()
      }
      if(moment().valueOf() > notify_at_morning){
        notify_at_morning = moment(morining).add(1,'days').valueOf()  
      }

      chrome.alarms.clearAll()
      chrome.alarms.create("tonight",{
          when: notify_at_tonight
      });
      chrome.alarms.create("morning",{
          when: notify_at_morning
      }); 
      chrome.alarms.create("weekend_1",{
          when: notify_at_weekend_1
      }); 
      chrome.alarms.create("weekend_2",{
          when: notify_at_weekend_2
      }); 

  })
}

// // Check whether new version is installed
// chrome.runtime.onInstalled.addListener(function(details){
//     if(details.reason == "install"){
//         console.log("This is a first install!");
//     }else if(details.reason == "update"){
//         var thisVersion = chrome.runtime.getManifest().version;
//         console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
//     }
// });
// 
chrome.runtime.onStartup.addListener(function(){
    console.log("onStartup")
    openBackgroundPage()
    chrome.storage.sync.set(timeDefaults, function() {
      console.log("setedTimeDefaults")
    })
})

// chrome.alarms.create('tonight', {
//     when: +new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0, 13, 0, 0)
// });

// // Listen
// chrome.alarms.onAlarm.addListener(function(alarm) {
//     if (alarm.name === 'tonight') {
//         console.log("tonight")
//         openBackgroundPage()
//     }
// });




chrome.runtime.onInstalled.addListener(function(details) {
  console.log("onInstalled")
  setAlarms()
  chrome.alarms.onAlarm.addListener(onAlarm); 
  // synchronize every 1 minute
  //chrome.alarms.create("extension.alarm", {periodInMinutes: 1});
  //chrome.alarms.clear("extension.alarm",function(){})
  //new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), 10, 0, 0)).getTime()
  //var now = new Date();
  //var d = new Date(now.getFullYear(),now.getMonth() ,now.getDay(),now.getHours(), 27, 0, 0);
  //d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 ) 
});




