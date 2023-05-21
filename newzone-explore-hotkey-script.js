/**
 * Select the ally/enemy in the chosen slot. If it can't be selected,
 * instead select the next slot down.
 * 
 * @param number Slot to select
 */
function selecttargetcascading(number) {
    if (ability_target[selected_pet] == 2) { // targets ally
        selected_target[selected_pet] = String(number);
        checkendturn();
    } else if (ability_target[selected_pet] == 1) { // targets enemy
        number += 3;
        for (let i = number; i < 7; ++i) {
            if (document.getElementById('enemyname' + i)) {
                selecttarget(i);
                break;
            }
        }
    }
}

/**
 * Generates a hotkey display element and inserts it before the given button.
 * 
 * @param button The button the hotkey applies to
 * @param key The Hotkey to dispaly
 * @returns The newly created hotkey HTML element
 */
function addHotkey(button, key) {
    var e = document.createElement('label');
    e.className = 'hotkeyoverlay2';
    e.style.marginTop = '2px';
    e.style.marginLeft = '10px';
    e.htmlFor = button.id;
    e.textContent = key;

    var container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = button.style.width;
    button.parentElement.insertBefore(container, button);
    container.appendChild(e);
    container.appendChild(button);
    return e;
}

function addEventHotkeys() {
    var keys = ['E', 'R', 'B'];
    for (let i = 0; i < 3; ++i) {
        let button = document.getElementById("eventbutton" + (i + 1));
        if (button) {
            addHotkey(button, keys[i]);
        }
    }
}

function addCloseHotkeys() {
    for (input of document.getElementsByTagName('input')) {
        if (input.type == 'button' && input.value == 'Close') {
            addHotkey(input, 'E');
        }
    }
}

function addHotkeys() {
    var in_event = document.getElementById("eventsummaryval").value == 1;
    var battle_summary = document.getElementById("battlesummaryval").value == 1;
    var storyevent = document.getElementById("storyeventval").value;
    var randomevent = document.getElementById("randomeventval").value;
    var bossevent = document.getElementById("bosseventval").value;
    if (in_event && (storyevent != "none" || randomevent != "none" || bossevent != "none")) {
        addEventHotkeys();
    } else if (in_event || battle_summary) {
        addCloseHotkeys();
    }
}

const observer = new MutationObserver(addHotkeys);
observer.observe(document.getElementById("eventsummaryval"), {attributes: true});

function triggerEvent(num) {
    var e = document.getElementById("eventbutton" + num);
    if (e) e.onclick();
}

//document.addEventListener('keypress', handlekeypress);


function chooseabilityviakey1(e) {
    if (lock_hotkeys == 0) {
        var evtobj = window.event ? event : e
        var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode
        textholder = textholder + String.fromCharCode(unicode);

        var battleid = document.getElementById("battleidval").value;
        var battleturn = document.getElementById("battleturnval").value;
        var storyevent = document.getElementById("storyeventval").value;
        var randomevent = document.getElementById("randomeventval").value;
        var bossevent = document.getElementById("bosseventval").value;

        var battle_summary = document.getElementById("battlesummaryval").value == 1;
        var in_event = document.getElementById("eventsummaryval").value == 1;

        if (battleid > 0 && battleturn == 0) {
            if (unicode == 98) // 'b'
            {
                parsecommand(2, 2);
            }
            else if (unicode == 114) // 'r'
            {
                parsecommand(2, 3);
            }
        }
        else if (battleid > 0) {
            if (selected_window == "attackdiv") {
                if (unicode == 48 || unicode == 49 || unicode == 50 || unicode == 51 || unicode == 52 || unicode == 53 || unicode == 116 || unicode == 102 || unicode == 109 || unicode == 98 || unicode == 115) {
                    var ability = document.getElementById(selected_window + "pet" + selected_pet + "hotkey" + unicode).value;
                    selectability(selected_pet, ability);
                }
                else if (unicode == 97) // 'a'
                {
                    openwindow("attackdiv");
                }
                else if (unicode == 113) // 'p'
                {
                    openwindow("managediv");
                }
            }
            else if (selected_window == "managediv") {
                if (unicode == 49 || unicode == 50 || unicode == 51 || unicode == 52 || unicode == 53 || unicode == 54) {
                    var action = document.getElementById(selected_window + "hotkey" + unicode).value;
                    selectaction(action);
                }
                else if (unicode == 97) {
                    openwindow("attackdiv");
                }
                else if (unicode == 113) {
                    openwindow("managediv");
                }
            }
            else { // no div selected
                if ((unicode == 49 || unicode == 50 || unicode == 51) &&
                    selected_ability[selected_pet] && !selected_target[selected_pet]) {
                    // choose a target
                    selecttargetcascading(unicode - 48);
                }
                if (unicode == 97) {
                    openwindow("attackdiv");
                }
                else if (unicode == 113) {
                    openwindow("managediv");
                }
                else if (unicode == 101) {
                    endbattleturn();
                }
                else if (unicode == 114) {
                    //RUN AWAY
                }
            }
        }  else if (battle_summary) {
            if (unicode == 101) // e
            {
                closebattlesummary();
            }
        } else if (in_event) {
            if (storyevent != "none" || randomevent != "none" || bossevent != "none") {
                // boat event?
                if (unicode == 101) { // 'e'
                    triggerEvent(1);
                } else if (unicode == 114) { // 'b'
                    triggerEvent(2);
                } else if (unicode == 98) { // 'r'
                    triggerEvent(3);
                }
            } else {
                // simple event summary
                if (unicode == 101) {
                    closeeventsummary();
                }
            }
        }
        else if (storyevent != "none" || randomevent != "none" || bossevent != "none") {
            if (unicode == 101) {
                parsecommand(2, 1);
            }
            else if (unicode == 114) {
                parsecommand(2, 4);
            }
        }
        else {
            if (unicode == 119) {
                if (buttonlist["movebutton1"] == 1) {
                    parsecommand(1, 1);
                }
            }
            else if (unicode == 97) {
                if (buttonlist["movebutton2"] == 1) {
                    parsecommand(1, 2);
                }
            }
            else if (unicode == 100) {
                if (buttonlist["movebutton3"] == 1) {
                    parsecommand(1, 3);
                }
            }
            else if (unicode == 115) {
                if (buttonlist["movebutton4"] == 1) {
                    parsecommand(1, 4);
                }
            }
        }

        //alert(unicode);
    }
}

document.onkeypress = chooseabilityviakey1;