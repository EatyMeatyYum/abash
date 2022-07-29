console.log("ABash loaded successfully");
nexusclient.datahandler().send_command("who here");
eventBus.unsubscribe('denizenSlain', 'denSlain');

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

  attackThings();
  //nexusclient.datahandler().send_command("attackThings");
}
eventBus.subscribe('denizenSlain', denSlain, 'denSlain');

function attackThings() {
  var roomItems = GMCP.Items.room;
  var prioList = nexusclient.variables().get("basharrrPrioList");
  var currentArea = nexusclient.variables().get("currentArea");
  var enemyList = prioList[currentArea];
  var enemyFound = false;
  var myClass = nexusclient.variables().get("curClass");
  var tempAttack = "gut";
  var bashing = nexusclient.variables().get("bashing");

  if(myClass == "Runewarden") {
    tempAttack = "battlefury focus speed | slaughter";
  } else if (myClass == "Red Dragon") {
    tempAttack = "gut";
  } else if (myClass == "Depthswalker") {
    tempAttack = "shadow reap";
  } else if (myClass == "Druid") {
    tempAttack = "maul";
  } else if (myClass == "earth Elemental Lord") {
    tempAttack = "terran pulverise";
  } else if (myClass == "Depthswalker") {
    tempAttack = "shadow reap";
  }
  
  nexusclient.variables().set("atkCommand", tempAttack);

  roomItems.forEach(function(el) {
    if(enemyList && enemyFound == false) {
    	enemyList.forEach(function(el2) {
	      if(el.name == el2) {
    	    enemyFound = true;
          nexusclient.datahandler().send_command("st " + el.id);
   	    }
      });
    }
  });

  if (enemyFound == false) {
    nexusclient.display_notice("No enemies found", "green");
    nexusclient.datahandler().send_command("st none");
    nexusclient.datahandler().send_command("disableBR");
  } else if (bashing == false) {
    nexusclient.datahandler().send_command("enableBR");
    nexusclient.datahandler().send_command(tempAttack);
  }
}
