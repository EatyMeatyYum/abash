console.log("ABash loaded successfully");
nexusclient.datahandler().send_command("who here");

if(!get_variable("basharrrPrioList")) {
  nexusclient.display_notice("There's no bashing prio list!!!", "red");
  var prioList = {};
  set_variable("basharrrPrioList", prioList);
} else {
  nexusclient.display_notice("Bashing Prio List loaded into repo!", "green");
}
