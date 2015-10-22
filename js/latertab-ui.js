var links = document.getElementById("groups")
function printAllStorage(){
  chrome.storage.sync.get(function(items){
    console.log("items",items)
    var syncItems = []
    for (key in items) {
      if(key.indexOf("http") === -1){
        continue;
      }
      var syncItem = items[key];
      console.log("syncItem"+ syncItem)
      syncItem.key = key;
      if (syncItem.title.length > 50){
        syncItem.title = syncItem.title.substr(0, 50) + "...";
      }
      syncItems.push(syncItem);
    }
    console.log("--syncItems--")
    console.log(syncItems)
    syncItems.sort(function(a, b){
      if(a.timestamp < b.timestamp) return 1;
      if(a.timestamp > b.timestamp) return -1;
      return 0;
    });
    
    var itemSize = syncItems.length
    for (var i = 0; i < itemSize; i++) {
      var list = document.createElement("li")
      list.innerHTML= createLinkHTML(syncItems[i], syncItems[i].key)
      links.appendChild(list);
      list.getElementsByClassName("removeBtn")[0].addEventListener("click", removeLink, false);
    }
    
    chrome.browserAction.setBadgeText({"text": badgeText(itemSize)});
  });
}

function createLinkHTML(listItem, url){
  var linkBtn = document.createElement("span");
  linkBtn.setAttribute("class", "removeBtn");
  linkBtn.setAttribute("name", url);
  var returnHTML = linkBtn.outerHTML+"<a target='_blank' href='"+url+"'>" + getIcon(url) + " " + listItem.title +"</a>";

  return returnHTML;
}

function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

function removeLink(e) {
  // body...
  var linkId = e.target; //Get the caller of the click event
  var linkDOMId = linkId.getAttribute("name"); //Get the key for the corresponding link
  //console.log("Removing link: "+ linkDOMId);
  var parentNode = linkId.parentNode.parentNode; //Get the <ul> list dom element for the current list item
  if(parentNode){
    var i = getChildNumber(linkId.parentNode); //Get the id of the <li> item in the given parentNode

    /**
     Remove the link from the sync storage
    */
    var key = linkDOMId;
    chrome.storage.sync.remove(key, function(){
      //console.log("Removed Link with key: "+key+"");
      //chrome.browserAction.setBadgeText({"text": badgeText(count)});
    });
    /**
    Remove the list item dom element from the UI
    */
    parentNode.removeChild(linkId.parentNode);
    //console.log("Removed Child");
  }  
}


function getIcon(url){
  var domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
  var imgUrl = "http://www.google.com/s2/favicons?domain=" + domain;

  var img = document.createElement("img");
  img.setAttribute('src', imgUrl);
  return img.outerHTML;
}

function badgeText(c){
    if(c > 999){
        return c.toString()+"+";
    }
    return c.toString();
}

printAllStorage()

