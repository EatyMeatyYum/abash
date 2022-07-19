console.log("ABash loaded successfully");
nexusclient.datahandler().send_command("who here");

if(!nexusclient.variables().get("basharrrPrioList")) {
  nexusclient.display_notice("There's no bashing prio list!!!", "red");
  var prioList = {};
  nexusclient.variables().set("basharrrPrioList", prioList);
} else {
  nexusclient.display_notice("Bashing Prio List loaded into repo!", "green");
}
