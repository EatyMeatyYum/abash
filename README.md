PRE-REQUISITES:
In order for ABash to work you will need the following:
 - Keneanung's eventBus package: https://keneanung.github.io/nexus-event-bus/EventBus.nxs
 - Argwin's eventBus events package
 - And the ABash package
 
They MUST be in that order in your Reflex Packages screen in Achaea.

HOW'S IT WORK?
 - First, you have to create a bashing button
    - Create either a keybind, button, or Nexus alias and set it to run the following command/alias:

          ABashAttack

 - When you kill a denizen it's added to a list, sorted by area.
 - Anytime you use your bashing button (keybind, alias, whatever) it will kill all denizens in the room that are already on the list.
 - NOTE: If you have not killed any denizens then your list is empty! If you install the package, set your bashing button, and then hit the button, nothing will happen. This is not a bug.

If you are interested in helping develop the ABash package, check the queue on the wiki, make a fork of the basher.js file in your own github account, make the changes, and create a pull request
so I can review it and merge it into the file. You will not see the update for 1 to 2 days because of how the CDN updates.

If you absolutely must see your update immediately, let me know and I can send you the commit ID and instructions on how to use it.

Argwin
