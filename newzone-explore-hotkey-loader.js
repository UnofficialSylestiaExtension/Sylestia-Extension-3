'use strict'
function loadScript(name) {
   var loaded_script = document.createElement("script");
   // chromium-based browsers:
   try {
      loaded_script.src = chrome.runtime.getURL(name);
   } catch {
      // firefox and safari browsers:
      try {
         loaded_script.src = browser.runtime.getURL(name);
      }
      catch (e) {
         console.log(e);
         alert("Sorry, your browser's method of accessing an extension's \
            web-accessible resources is not supported.");
      }
   }

   loaded_script.onload = function () {
      this.remove();
   };
   (document.head || document.documentElement).appendChild(loaded_script);
}
loadScript("newzone-explore-hotkey-script.js");