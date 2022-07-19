console.log("ABash loaded successfully");
nexusclient.datahandler().send_command("who here");

if(!nexusclient.variables().get("basharrrPrioList")) {
  nexusclient.display_notice("There's no bashing prio list!!!", "red");
  var prioList = {};
  nexusclient.variables().set("basharrrPrioList", prioList);
} else {
  nexusclient.display_notice("Bashing Prio List loaded into repo!", "green");
}

// Trigger: When a denizen is slain

var denSlain = function(denizen) {
  var slainDenizen = denizen;
  var currentArea = nexusclient.variables().get("currentArea");
  var prioList = nexusclient.variables().get("basharrrPrioList");

  if(prioList[currentArea]) {
    // Area already exists in prio list
    var denizenList = prioList[currentArea];
    console.log(denizenList);
    if(!denizenList.includes(slainDenizen)) {
      nexusclient.display_notice("[ABASH]: New denizen added", "yellow");
      denizenList.push(slainDenizen);
      prioList[currentArea] = denizenList;
      nexusclient.variables().set("basharrrPrioList", prioList);
    }
  } else {
    // Area does not exist in prio list
    var denizenList = [];
    denizenList.push(slainDenizen);
    prioList[currentArea] = denizenList;
    console.log(prioList);
    nexusclient.variables().set("basharrrPrioList", prioList);
    nexusclient.display_notice("[ABASH]: New area added", "yellow");
    nexusclient.display_notice("[ABASH]: New denizen added", "yellow");
  }

  nexusclient.datahandler().send_command("attackThings");
}
eventBus.subscribe('denizenSlain', denSlain, 'denSlain');
