PRE-REQUISITES:
In order for ABash to work you will need the following:
 - Keneanung's eventBus package: https://keneanung.github.io/nexus-event-bus/EventBus.nxs
 - Argwin's eventBus events package
 - And the ABash package
 
They MUST be in that order in your Reflex Packages screen in Achaea.

NOTE: After installing all three packages, in the right order, you will need to either log off and then back on, or reset the package in the Reflex Packages settings screen.

HOW'S IT WORK?
 - First, you have to create a bashing button
    - Create either a keybind, button, or Nexus alias and set it to run the following command/alias:

          ABashAttack

 - When you kill a denizen it's added to a list, sorted by area.
 - Anytime you use your bashing button (keybind, alias, whatever) it will kill all denizens in the room that are already on the list.
 - NOTE: If you have not killed any denizens then your list is empty! If you install the package, set your bashing button, and then hit the button, nothing will happen. This is not a bug.

Known Weirdness:
 - If ABash sets the target but does not attack - use CONFIG COMMANDSEPARATOR - if you do not have a command separator set, set one using CONFIG COMMANDSEPARATOR <whatever you want>

Argwin
