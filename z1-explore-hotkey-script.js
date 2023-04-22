(() => {
   var enemyID = [];

   function getIDs() {
      var newID = document.getElementById("currentbattleid").value;
      if (newID == "0" || newID == "") return; // not in a battle
      //console.log("getting IDs");

      var expdiv = document.getElementById("explorewindowdiv");
      enemyID.length = 0;
      for (td of expdiv.getElementsByTagName("td")) {
         if (td.align == "right") {
            // enemy TD
            if (td.childElementCount == 0) enemyID.push(0);
            else enemyID.push(td.firstElementChild.id.replace("battlemonster", ""));
         }
      }
      // reorder so that middle enemy is "1"
      var tmp = enemyID[0];
      enemyID[0] = enemyID[1];
      enemyID[1] = tmp;
   }
   getIDs();

   const config = { attributes: false, childList: true, subtree: true };
   const observer = new MutationObserver(getIDs);

   //var expdiv = document.getElementById("explorewindowdiv");
   observer.observe(document.getElementById("battlewindowdiv"), config);

   function useabilitykey(key) {
      var ability = document.getElementById(selected_pet + "abilityhotkey" + key.charCodeAt());
      if (ability) {
         selectability(selected_pet, ability.value);
         return true;
      } else return false;
   }

   function hotkey(e) {
      var sediv = document.getElementById("specialeventdiv");     // special event div

      if (sediv && sediv.style.display == "inline") {
         // in a special event popup
         switch (e.key) {
            case 'e':
               var button1 = document.getElementById("sebutton1");
               if (button1) {  // choose first option
                  button1.onclick();
               } else {        // no options to choose: close event
                  closespecialevent();
               }
               break;
            case 'r':
               // choose second option
               var button2 = document.getElementById("sebutton2");
               if (button2) button2.onclick();
               break;
            default:
               break;
         }
      } else {
         // not in a special event popup
         switch (e.key) {
            case 'i':
               // show equipment window
               showwindow("playerequipmentdiv");
               break;
            case 'p':
               // show party manager window
               showwindow("partymanagerdiv");
               break;
            case 'e':
               // Explore, End turn, or Exit battle summary, depending on situation
               // must have special event checks first, since needing to close the special event window can happen in-battle
               // and with the explorethearea() button existing
               var summary = document.getElementById("battlesummarydiv");  // battle summary

               if (document.getElementById("specialeventbutton")) { // special event begins
                  openspecialevent();
               }
               else if (summary && summary.style.display == "inline") { // in battle summary
                  closebattlesummary();
               }
               else if (document.getElementById("explorebutton")) { // exploring
                  explorethearea();
               }
               else if (document.getElementById("endturnbutton")) { // in battle
                  endturn();
               }
               break;
            case 'r':
               // retreat from battle
               if (document.getElementById("retreatbutton")) {
                  retreatevent();
               }
               break;
            case 'q':
               // deselect ability
               var sel = pet_ability[selected_pet];
               if (sel) {
                  selectability(selected_pet, sel);
               }
               break;
            case 'b':
               if (document.getElementById("battlebutton")) {
                  // start battle
                  beginbattle();
               } else {
                  // block
                  useabilitykey(e.key);
               }
               break;
            case '1':
            case '2':
            case '3':
               switch (lock_ability) {
                  case 0:
                     // choose an ability
                     useabilitykey(e.key);
                     break;
                  case 1:
                     // choose an enemy for a single-target ability
                     var i = e.key - 1;
                     // check if enemy exists
                     while (enemyID[i] == 0) {
                        if (i >= 3) return; // nothing to select
                        ++i; // check next enemy
                     }
                     selecttarget(enemyID[i]);
                     break;
                  case 2:
                     // choose an ally for a single-target ability
                     var pet = document.getElementById("activepetid" + e.key);
                     selectpet(pet.value);
                     break;
               }
               break;
            default:
               // check if key is assigned to an ability
               useabilitykey(e.key);
               break;
         }
      }
   }

   // replace pre-existing key press handler so that events don't trigger twice
   document.onkeypress = hotkey;
})();