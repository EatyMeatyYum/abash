const abash = {
	startUp() {
		console.log("ABash loaded successfully");
		
		// declare namespace variables
		const version = 1.5;
		let currentArea = "";
		let prioList = {};
		let classAttacks = {};
		let myClass;
		abash.myClass = nexusclient.datahandler().GMCP.Status.class;
		console.log("ABash class set to: " + abash.myClass);
		let bashAttack;

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
		eventBus.unsubscribe('onClassChange', "checkClassAttack");

		if(!nexusclient.variables().get("basharrrPrioList")) {
			nexusclient.display_notice("There's no bashing prio list!!!", "red");
			abash.prioList = {};
			nexusclient.variables().set("basharrrPrioList", abash.prioList);
		} else {
			abash.prioList = nexusclient.variables().get("basharrrPrioList");
			nexusclient.display_notice("Bashing Prio List loaded into repo!", "green");
		}

		if(!nexusclient.variables().get("abashClassAttacks")) {
			abash.classAttacks = {};
			nexusclient.variables().set("abashClassAttacks", abash.classAttacks);
		} else {
			abash.classAttacks = nexusclient.variables().get("abashClassAttacks");
		}

		if(abash.myClass in abash.classAttacks) {
			abash.bashAttack = abash.classAttacks[abash.myClass];
		} else {
			abash.bashAttack = "kill";
		}
		console.log("myClass: " + abash.myClass);
		console.log("ABash bashing attack: " + abash.bashAttack);

		// Trigger: When a denizen is slain
		const denSlain = function(denizen) {
			let slainDenizen = denizen;
			abash.currentArea = nexusclient.datahandler().GMCP.Location.areaname;

			if(abash.prioList[abash.currentArea]) {
				// Area already exists in prio list
				let denizenList = abash.prioList[abash.currentArea];
				console.log(denizenList);
				if(!denizenList.includes(slainDenizen)) {
					nexusclient.display_notice("[ABASH]: New denizen added", "yellow");
					denizenList.push(slainDenizen);
					abash.prioList[abash.currentArea] = denizenList;
					nexusclient.variables().set("basharrrPrioList", abash.prioList);
				}
			} else {
				// Area does not exist in prio list
				let denizenList = [];
				denizenList.push(slainDenizen);
				abash.prioList[abash.currentArea] = denizenList;
				console.log(abash.prioList);
				nexusclient.variables().set("basharrrPrioList", abash.prioList);
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

		const checkClassAttack = function() {
			abash.myClass = nexusclient.datahandler().GMCP.Status.class;
			nexusclient.display_notice("Current Class: " + abash.myClass);
			if(abash.myClass in abash.classAttacks) {
				abash.bashAttack = abash.classAttacks[abash.myClass];
			} else {
				abash.bashAttack = "kill";
			}
			nexusclient.display_notice("Bashing Attack: " + abash.bashAttack);
			if(abash.bashAttack == "kill") {
				nexusclient.display_notice("To set your class bashing attack use ABASH SET ATTACK <attack>");
			}
		} // End checkClassAttack()
		eventBus.subscribe('onClassChange', checkClassAttack, 'checkClassAttack');

	}, // End startUp()
	
	attackThings() {
		let roomItems = nexusclient.datahandler().GMCP.Items.room;
		abash.prioList = nexusclient.variables().get("basharrrPrioList");
		abash.currentArea = nexusclient.datahandler().GMCP.Location.areaname;
		let enemyList = abash.prioList[abash.currentArea];
		let enemyFound = false;
		let bashing = nexusclient.variables().get("bashing");

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
			nexusclient.variables().set("bashing", false);
		} else if (bashing == false) {
			nexusclient.variables().set("bashing", true);
			nexusclient.datahandler().send_command(abash.bashAttack);
		}
	}, // End attackThings()

    runCommand(suffix) {
        let command = suffix;
		
		if (command.startsWith("remove prio")) {
			let enemyRemoval = command.slice(12);
			abash.currentArea = nexusclient.datahandler().GMCP.Location.areaname;
			let enemyList = abash.prioList[abash.currentArea];
			let enemyFound = false;
			
			enemyList.forEach(function(el) {
				if(el == enemyRemoval) {
					enemyFound = true;
				}
			})
			
			if (enemyFound) {
				let enemyIndex = enemyList.indexOf(enemyRemoval);
				if (enemyIndex !== -1) {
  					enemyList.splice(enemyIndex, 1);
					abash.prioList[abash.currentArea] = enemyList;
					nexusclient.display_notice("Enemy removed from prio list", "green");
				}
			} else {
				nexusclient.display_notice("Enemy not found in this area.", "red");
			}
		} else if (command.startsWith("set attack")) {
			let newAttack = command.slice(11);
			abash.bashAttack = newAttack;
			abash.classAttacks[abash.myClass] = newAttack;
			nexusclient.variables().set("abashClassAttacks", abash.classAttacks);
		} else {

	                switch (command) {
				
				case "help":
					nexusclient.display_notice("ABash Help", "white");
					nexusclient.display_notice("-----------------", "white");
					nexusclient.display_notice("abash show prios here - list prio denizens in current area", "white");
					nexusclient.display_notice(" - click on red X to remove a denizen from the prio list", "white");
					nexusclient.display_notice("abash set attack <attack> - Sets the bashing attack for your current class.", "white");
					nexusclient.display_notice("*Note: if you're setting a multicommand attack you will need to change your commandseparator first, then set it back afterwards.", "white");
					break;
				case "show prios here":
					abash.currentArea = nexusclient.datahandler().GMCP.Location.areaname;
					let enemyList = abash.prioList[abash.currentArea];
					let str = "<span style='color:white'>Area: " + abash.currentArea + "</span>\n";
					str += "<span style='color:white'>-----------------</span>\n";
					enemyList.forEach(function(el) {
						str += "<span style='white'>[</span><span style='color:red' onClick='(function() { abash.runCommand(\"remove prio " + el + "\") })();'> X </span><span style='color:white'>] " + el + "</span>\n";
					});
					str += "<span style='color:white'>-----------------</span>\n";
					nexusclient.add_html_line(str);
					break;
				default:
					nexusclient.display_notice("Command not recognized.", "white");
			}
        }
    },

	commitAttack() {
		let bashing = nexusclient.variables().get("bashing");

		if(bashing) {
			nexusclient.datahandler().send_command(abash.bashAttack);
		}
	}, // End commitAttack()

} // End of namespace

window.abash = abash;
