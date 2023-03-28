
function randomizeTraits() {
    for (var i = 1; i <= 6; ++i) {
        var trait = document.getElementById("trait_" + i);
        var len = trait.length;
        var index = Math.floor(Math.random() * len);
        trait.selectedIndex = index;
        trait.onchange();
        //check_selected_trait(i);
    }
    update_generator();
}

// if the randomizer button already exists, don't create another one
if (document.getElementById("trait_randomizer_button") === null) {
    var trait_randomizer_string = 
        'for (var i = 1; i <= 6; ++i) { \
            var trait = document.getElementById("trait_" + i); \
            var len = trait.length; \
            var index = Math.floor(Math.random() * len); \
            trait.selectedIndex = index; \
            trait.onchange(); \
        } \
        update_generator();';

    // create the button for randomizing traits
    var randomizeButton = document.createElement("input");
    randomizeButton.id = "trait_randomizer_button";
    randomizeButton.type = "button";
    randomizeButton.value = "Randomize";
    randomizeButton.setAttribute("onclick", trait_randomizer_string);
    // standard sylestia button style
    randomizeButton.className = "main_button";
    // standard sylestia button size
    randomizeButton.style = "text-align: center;margin: .5em;width: 140px;height: 34px;";

    // append to the end of the trait selection section
    document.getElementById("div_traits").parentElement.appendChild(randomizeButton);
}
