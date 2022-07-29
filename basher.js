const abash = {
	startUp() {
		console.log("ABash loaded successfully");
		nexusclient.datahandler().send_command("who here");

		// In case of package reset, unsubscribe from all associated events
		eventBus.unsubscribe('denizenSlain', 'denSlain');
		eventBus.unsubscribe('affRemProne', 'attackReady');
		eventBus.unsubscribe('affRemParalysis', 'attackReady');
		eventBus.unsubscribe('affRemBound', 'attackReady');
		eventBus.unsubscribe('affRemEntangled', 'attackReady');
		eventBus.unsubscribe('affRemTransfixation', 'attackReady');
		eventBus.unsubscribe('affRemWebbed', 'attackReady');
		eventBus.unsubscribe('affRemStunned', 'attackReady');
		eventBus.unsubscribe('onEq', 'attackReady');
		eventBus.unsubscribe('onBal', 'attackReady');

		if(!nexusclient.variables().get("basharrrPrioList")) {
			nexusclient.display_notice("There's no bashing prio list!!!", "red");
			var prioList = {};
			nexusclient.variables().set("basharrrPrioList", prioList);
		} else {
			nexusclient.display_notice("Bashing Prio List loaded into repo!", "green");
		}

		// Trigger: When a denizen is slain

		const denSlain = function(denizen) {
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

			abash.attackThings();
		}
		eventBus.subscribe('denizenSlain', denSlain, 'denSlain');

		// Trigger: Main attack trigger
		const attackReady = function() {
			abash.commitAttack();
		}
		eventBus.subscribe('affRemProne', attackReady, 'attackReady');
		eventBus.subscribe('affRemParalysis', attackReady, 'attackReady');
		eventBus.subscribe('affRemBound', attackReady, 'attackReady');
		eventBus.subscribe('affRemEntangled', attackReady, 'attackReady');
		eventBus.subscribe('affRemTransfixation', attackReady, 'attackReady');
		eventBus.subscribe('affRemWebbed', attackReady, 'attackReady');
		eventBus.subscribe('affRemStunned', attackReady, 'attackReady');
		eventBus.subscribe('onEq', attackReady, 'attackReady');
		eventBus.subscribe('onBal', attackReady, 'attackReady');

	},
	
	attackThings() {
		nexusclient.display_notice("Running attackThings function!", "yellow");
		var roomItems = nexusclient.datahandler().GMCP.Items.room;
		var prioList = nexusclient.variables().get("basharrrPrioList");
		var currentArea = nexusclient.variables().get("currentArea");
		var enemyList = prioList[currentArea];
		var enemyFound = false;
		nexusclient.display_notice("enemyFound = false", "yellow");
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
						nexusclient.display_notice("Found an enemy!", "yellow");
						nexusclient.datahandler().send_command("st " + el.id);
					}
				});
			}
		});

		if (enemyFound == false) {
			nexusclient.display_notice("No enemies found", "green");
			nexusclient.datahandler().send_command("st none");
			nexusclient.variables().set("bashing", false);
		} else if (bashing == false) {
			nexusclient.variables().set("bashing", true);
			nexusclient.datahandler().send_command(tempAttack);
		}
	},

	commitAttack() {
		var bashing = nexusclient.variables().get("bashing");

		if(bashing) {
			//var atkCommand = "gut";
			var atkCommand = nexusclient.variables().get("atkCommand");

			nexusclient.datahandler().send_command(atkCommand);
		}
	}

} // End of namespace

window.abash = abash;
