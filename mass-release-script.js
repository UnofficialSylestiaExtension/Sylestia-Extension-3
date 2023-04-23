(() => {
   // Flag if mass release is enabled
   // global variable
   window.mass_release = false;

   /**
    * Bundles all of the data related to a stable stall
    *  (pet ID, stable ID, tab number, stall number)
    */
   class pet_stall_info {
      constructor(stable, tab, stall) {
         this.id = 0;
         this.stable = stable;
         this.tab = tab;
         this.stall = stall;
         var id_element = this.get_id();
         if (id_element) this.id = id_element.value;
      }
      /**
       * Get the DOM object for this stall
       * @returns DOM object that corresponds to the stall id
       */
      get_id() {
         return document.getElementById("stable" + this.stable + "tab" + this.tab + "stall" + this.stall + "_id");
      }
      /**
       * Used for changing the highlight of the pet stall
       * @returns DOM Object that corresponds to the stall
       */
      get_stall_div() {
         return document.getElementById("div_stable" + this.stable + "tab" + this.tab + "stall" + this.stall);
      }

      /**
       * Get the name of the pet (unmodified string)
       * @returns The name of the pet
       */
      get_name() {
         return document.getElementById("stable" + this.stable + "tab" + this.tab + "stall" + this.stall + "_name").value;
      }
   }

   /**
    * List of selected pet/stalls
    * global object
    */
   window.selected_pets_list = {
      pet_infos: [],
      action_button: null,
      toggle_pet: function (stall_info) {
         var index = this.pet_infos.findIndex((i) => i.id === stall_info.id);
         if (index === -1) {
            // add
            this.pet_infos.push(stall_info);
            stall_info.get_stall_div().className = "high_bg1";
            // enable the button
            if (this.action_button) this.action_button.className = "yes_button";
         } else {
            // remove
            this.pet_infos.splice(index, 1);
            stall_info.get_stall_div().className = "high_bg2";
            if (this.pet_infos.length === 0) {
               // disable the button if no pets selected
               if (this.action_button) this.action_button.className = "gray_button";
            }
         }
      },
      contains: function (stall_info) {
         return stall_info.id > 0 && (this.pet_infos.findIndex((i) => i.id === stall_info.id)) >= 0;
      },
      clear: function () {
         if (this.action_button) this.action_button.className = "gray_button";
         this.action_button = null;
         for (let i = 0; i < this.pet_infos.length; ++i) {
            this.pet_infos[i].get_stall_div().className = "main_bg3";
         }
         this.pet_infos.length = 0;
      }
   };

   /**
    * Toggles the mass release function.
    * @param enable Whether to enable or disable the mass release function
    */
   function toggle_mass_release(enable = true) {
      var div_top = document.getElementById("div_top_selection3");
      var base_div_top = document.getElementById("div_top_selection1");
      mass_release = enable;
      if (enable) {
         // enable mass release
         div_top.style.display = "block";
         base_div_top.style.display = "none";
         selected_pets_list.action_button = document.getElementById("button_mass_release");
      }
      else {
         // disable mass release
         div_top.style.display = "none";
         base_div_top.style.display = "inline";
         document.getElementById("mass_release_number").textContent = "No pets selected";
         // empty the mass-move data structure
         selected_pets_list.clear();
      }
   }

   /**
    * Called when the mass release button is pressed.
    * Prompts the user for confirmation, then releases all if confirms.
    */
   function toggle_mass_release_popup(enable = true) {
      if (mass_release) {
         var popup = document.getElementById("div_confirm_release");
         var bg = document.getElementById("bg_confirm_release");
         if (enable) {
            // open popup
            popup.style.display = "block";
            bg.style.display = "block";
            var names = document.getElementById("div_confirm_release_names");
            names.replaceChildren();
            names.appendChild(document.createElement("br"));
            for (let i = 0; i < selected_pets_list.pet_infos.length; ++i) {
               var pet_info = selected_pets_list.pet_infos[i];
               var span = document.createElement("a");
               span.className = "textlink";
               span.textContent = pet_info.get_name();
               span.href = "/view/pets/?petid=" + pet_info.id;
               names.appendChild(span);
               names.appendChild(document.createElement("br"));
            }
         } else {
            // close popup
            popup.style.display = "none";
            bg.style.display = "none";
         }
      }
   }

   /**
    * Releases all selected pets
    */
   function mass_release_selected() {
      if (mass_release && lockout_stable === 0) {
         lockout_stable = 1;
         Promise.all(
            selected_pets_list.pet_infos.map((val, _index, _array) => {
               console.log("releasing pet " + val.get_name());
               return fetch("https://www.sylestia.com/view/pets/?petid=" + val.id, {
                  method: "POST",
                  body: "confirm=" + encodeURIComponent(val.get_name()).replaceAll("%20", "+") + "&release=Confirm",
                  headers: {
                     "Content-Type": "application/x-www-form-urlencoded",
                  },
               });
            }))
            .then(_responses => {
               // wait for all the requests to finish, then clean up and unlock stable
               toggle_mass_release_popup(false);
               toggle_mass_release(false);
               lockout_stable = 0;
               switch_stables(1);
            })
            .catch(_error => {
               alert("Something went wrong. Please reload the page and try again.")
            });
      }
   }

   /**
    * Releases a pet
    * @param ID Pet ID of the pet to be released
    * @param NAME Name of the pet to be released
    */
   function release_pet(ID, NAME) {
      fetch("https://www.sylestia.com/view/pets/?petid=" + ID, {
         method: "POST",
         body: "confirm=" + encodeURIComponent(NAME).replaceAll("%20", "+") + "&release=Confirm",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
      });
   }


   // patch the function stall_select to allow for selecting for mass release:
   stall_select = function stall_select(stable, tab, stall) {
      /* SYLESTIA CODE */
      if (lockout_stable == 0) {
         if (mass_move == 1) {
            var element1 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

            if (element1) {
               if (element1.value != 0) {
                  var pet_id = element1.value;

                  var slot = mass_move_pets.indexOf(pet_id);

                  if (slot == -1) {
                     mass_move_pets.push(pet_id);
                     mass_move_stables.push(stable);
                     mass_move_tabs.push(tab);
                     mass_move_stalls.push(stall);

                     document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg1";

                     document.getElementById("button_mass_move").className = "yes_button";
                  }
                  else {
                     mass_move_pets.splice(slot, 1);
                     mass_move_stables.splice(slot, 1);
                     mass_move_tabs.splice(slot, 1);
                     mass_move_stalls.splice(slot, 1);
                     document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg2";

                     if (mass_move_pets.length == 0) {
                        document.getElementById("button_mass_move").className = "gray_button";
                     }
                  }
               }
            }
         }
         /* END SYLESTIA CODE */
         /* EXTENSION 3 PATCH */
         else if (mass_release) {
            var stall_info = new pet_stall_info(stable, tab, stall);
            if (stall_info.id != 0) {
               selected_pets_list.toggle_pet(stall_info);
               var display = "";
               var num_selected = selected_pets_list.pet_infos.length;
               if (num_selected === 0) display = "No pets selected";
               else if (num_selected === 1) display = "One pet selected";
               else display = num_selected + " pets selected";
               document.getElementById("mass_release_number").textContent = display;
            }
         }
         /* END EXTENSION 3 PATCH */
         /* RESUME SYLESTIA CODE */
         else {
            //REMOVE SELECTION
            if (stable == selected_stable && tab == selected_tab && stall == selected_stall) {
               var element1 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

               if (element1) {
                  document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg2";

                  selected_stable = 0;
                  selected_tab = 0;
                  selected_stall = 0;
                  selected_pet_id = 0;
                  selected_pet_name = 0;
                  selected_pet_level = 0;
                  selected_pet_info = 0;

                  document.getElementById("div_selection1").innerHTML = "None Selected";
                  document.getElementById("div_selection2").innerHTML = "&nbsp;";
               }
            }
            //SWITCH SLOTS
            else if (selected_stable != 0 && selected_tab != 0 && selected_stall != 0) {
               switch_stalls(stable, tab, stall);
            }
            //CREATE SELECTION
            else {
               var element1 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

               if (element1) {
                  if (element1.value != 0) {
                     var element2 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_name");
                     var element3 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_info");
                     var element4 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_level");

                     document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg1";

                     selected_stable = stable;
                     selected_tab = tab;
                     selected_stall = stall;
                     selected_pet_id = element1.value;
                     selected_pet_name = element2.value;
                     selected_pet_level = element4.innerHTML;
                     document.getElementById("div_selected_pet").innerHTML = element3.innerHTML;

                     document.getElementById("div_selection1").innerHTML = '<a class="textlink" href="/view/pets/?petid=' + selected_pet_id + '" target="_blank" />' + selected_pet_name + '</a>';
                     document.getElementById("div_selection2").innerHTML = "(Stable ID #" + stable + ", Tab " + tab + ", Stall " + stall + ")";
                  }
               }
            }
         }
      }
   }

   // patch the stall_hover methods to account for mass release
   stall_hoveron = function stall_hoveron(stable, tab, stall) {
      /* SYLESTIA CODE */
      if (lockout_stable == 0) {
         if (mass_move == 1) {
            var element1 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

            if (element1) {
               var pet_id = element1.value;

               var slot = mass_move_pets.indexOf(pet_id);

               if (slot == -1) {
                  document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg2";
               }
            }
         }
         /* END SYLESTIA CODE */
         /* EXTENSION 3 PATCH */
         else if (mass_release) {
            var stall_info = new pet_stall_info(stable, tab, stall);
            if (stall_info.id != 0 && !selected_pets_list.contains(stall_info))
               stall_info.get_stall_div().className = "high_bg2";
         }
         /* END EXTENSION 3 PATCH */
         /* RESUME SYLESTIA CODE */
         else {
            if (stable != selected_stable || tab != selected_tab || stall != selected_stall) {
               var element = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

               if (element) {
                  document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "high_bg2";
               }
            }
         }
      }
   }

   // patch stall hover off function to account for mass release
   stall_hoveroff = function stall_hoveroff(stable, tab, stall) {
      /* SYLESTIA CODE */
      if (lockout_stable == 0) {
         if (mass_move == 1) {
            var element1 = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

            if (element1) {
               var pet_id = element1.value;

               var slot = mass_move_pets.indexOf(pet_id);

               if (slot == -1) {
                  document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "main_bg3";
               }
            }
         }
         /* END SYLESTIA CODE */
         /* EXTENSION 3 PATCH */
         else if (mass_release) {
            var stall_info = new pet_stall_info(stable, tab, stall);
            if (stall_info.id != 0 && !selected_pets_list.contains(stall_info))
               stall_info.get_stall_div().className = "main_bg3";
         }
         /* END EXTENSION 3 PATCH */
         /* RESUME SYLESTIA CODE */
         else {
            if (stable != selected_stable || tab != selected_tab || stall != selected_stall) {
               var element = document.getElementById("stable" + stable + "tab" + tab + "stall" + stall + "_id");

               if (element) {
                  document.getElementById("div_stable" + stable + "tab" + tab + "stall" + stall).className = "main_bg3";
               }
            }
         }
      }
   }


   // Create mass release HTML objects:
   function create_release_buttons() {
      if (!document.getElementById("div_top_selection3")) {
         var div_top_3 = document.createElement("div");
         div_top_3.id = "div_top_selection3";
         div_top_3.style.display = "none";
         div_top_3.style.height = "36px";
         div_top_3.style.paddingTop = "4px";
         div_top_3.style.boxSizing = "border-box";

         var cancel_mass_release = document.createElement("input");
         cancel_mass_release.id = "cancel_mass_release";
         cancel_mass_release.className = "no_button";
         cancel_mass_release.type = "button";
         cancel_mass_release.value = "Disable Mass Release";
         cancel_mass_release.style.width = "140px";
         cancel_mass_release.style.float = "right";
         cancel_mass_release.style.marginRight = "180px";
         //cancel_mass_release.setAttribute("onclick", "toggle_mass_release(false)");
         cancel_mass_release.onclick = () => { toggle_mass_release(false); };

         var number_selected = document.createElement("span");
         number_selected.textContent = "No pets selected";
         number_selected.id = "mass_release_number";
         number_selected.style.color = "black";

         var number_selected_text = document.createElement("span");
         number_selected_text.className = "main_font1";
         number_selected_text.style.fontWeight = "bold";
         number_selected_text.style.float = "left";
         number_selected_text.style.marginTop = "4px";
         number_selected_text.style.marginLeft = "30px";
         number_selected_text.textContent = "Pets selected: ";
         number_selected_text.appendChild(number_selected);

         var mass_release_button = document.createElement("input");
         mass_release_button.id = "button_mass_release";
         mass_release_button.className = "gray_button";
         mass_release_button.type = "button";
         mass_release_button.value = "RELEASE";
         mass_release_button.style.width = "100px";
         mass_release_button.style.float = "left";
         //mass_release_button.setAttribute("onclick", "toggle_mass_release_popup(true)");
         mass_release_button.onclick = () => { toggle_mass_release_popup(true); };

         var link_img = document.getElementById("div_top_selection1")
            .getElementsByTagName("img")[0]
            .cloneNode(true);
         link_img.style.float = "right";
         link_img.style.paddingTop = "4px";

         div_top_3.appendChild(mass_release_button);
         div_top_3.appendChild(number_selected_text);
         div_top_3.appendChild(link_img);
         div_top_3.appendChild(cancel_mass_release);

         var enable_mass_release = document.createElement("input");
         enable_mass_release.title = "Use this feature to release multiple pets at the same time.";
         enable_mass_release.id = "enable_mass_release";
         enable_mass_release.className = "yes_button";
         enable_mass_release.type = "button";
         enable_mass_release.value = "Enable Mass Release";
         enable_mass_release.style.width = "140px";
         enable_mass_release.style.marginRight = "20px";
         //enable_mass_release.setAttribute("onclick", "toggle_mass_release(true)");
         enable_mass_release.onclick = () => { toggle_mass_release(true); };

         document.getElementById("div_top_selection1")
            .getElementsByTagName("input")[0]
            .insertAdjacentElement("beforebegin", enable_mass_release);
         document.getElementById("div_top_selection2").insertAdjacentElement("afterend", div_top_3);
      }
   }


   // Confirm Release popup
   function create_release_popup() {
      var bg_confirm_release = document.createElement("div");
      bg_confirm_release.id = "bg_confirm_release";
      bg_confirm_release.style.width = "100%";
      bg_confirm_release.style.height = "100%";
      bg_confirm_release.style.position = "fixed";
      bg_confirm_release.style.top = "0%";
      bg_confirm_release.style.left = "0%";
      bg_confirm_release.style.backgroundColor = "rgb(0, 0, 0)";
      bg_confirm_release.style.opacity = "0.3";
      bg_confirm_release.style.display = "none";
      bg_confirm_release.style.zIndex = "100000";
      //bg_confirm_release.className = "dialog_bg_overlay";

      document.getElementById("div_buy_tab")
         .insertAdjacentElement("afterend", bg_confirm_release);

      var confirm_popup = document.createElement("div");
      confirm_popup.id = "div_confirm_release";
      confirm_popup.className = "dialogue_div";
      confirm_popup.style.width = "300px";
      confirm_popup.style.position = "fixed";
      confirm_popup.style.left = "50%";
      confirm_popup.style.top = "10%";
      confirm_popup.style.marginLeft = "-150px";
      confirm_popup.style.display = "none";
      confirm_popup.style.zIndex = "100001";

      bg_confirm_release.insertAdjacentElement("afterend", confirm_popup);

      var confirm_body = document.createElement("div");
      confirm_body.className = "dialogue_main";
      confirm_body.style.overflow = "hidden";
      confirm_body.style.fontWeight = "bold";
      confirm_popup.appendChild(confirm_body);

      var confirm_header = document.createElement("div");
      confirm_header.className = "dialogue_head";
      confirm_header.style.fontSize = "24px";
      confirm_header.style.height = "34px";
      confirm_header.textContent = "Confirm Release";
      confirm_body.appendChild(confirm_header);

      var confirm_sub = document.createElement("div");
      confirm_sub.className = "dialogue_sub";
      confirm_sub.style.paddingTop = "5px";
      confirm_body.appendChild(confirm_sub);

      var confirm_text = document.createElement("p");
      confirm_text.className = "no_font";
      confirm_text.textContent = "Please confirm the release of the following pets:";
      confirm_sub.appendChild(confirm_text);

      var confirm_release_names = document.createElement("div");
      confirm_release_names.id = "div_confirm_release_names";
      confirm_sub.appendChild(confirm_release_names);

      var confirm_buttons = document.createElement("div");
      confirm_buttons.style.height = "28px";
      confirm_buttons.style.padding = "10px";
      confirm_sub.appendChild(confirm_buttons);

      var confirm_release_button = document.createElement("input");
      confirm_release_button.id = "confirm_release";
      confirm_release_button.className = "no_button";
      confirm_release_button.type = "button";
      confirm_release_button.value = "RELEASE";
      confirm_release_button.style.width = "90px";
      confirm_release_button.style.float = "left";
      confirm_release_button.style.marginLeft = "10px";
      //confirm_release_button.setAttribute("onclick", "mass_release_selected()");
      confirm_release_button.onclick = mass_release_selected;
      confirm_buttons.appendChild(confirm_release_button);

      var cancel_release_button = document.createElement("input");
      cancel_release_button.id = "cancel_release_dialog";
      cancel_release_button.className = "main_button";
      cancel_release_button.type = "button";
      cancel_release_button.value = "Cancel";
      cancel_release_button.style.width = "90px";
      cancel_release_button.style.float = "right";
      cancel_release_button.style.marginRight = "10px";
      //cancel_release_button.setAttribute("onclick", "toggle_mass_release_popup(false)");
      cancel_release_button.onclick = () => { toggle_mass_release_popup(false); };
      confirm_buttons.appendChild(cancel_release_button);
   }

   create_release_buttons();
   create_release_popup();

   // mutation observer to re-create buttons when stable is reloaded
   // from finishing mass move or mass release
   const config = { attributes: false, childList: true, subtree: true };
   const observer = new MutationObserver(create_release_buttons);
   // start observing the node
   observer.observe(document.getElementById("div_allstables"), config);
})();