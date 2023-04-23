var explore_script = document.createElement("script");
// chromium-based browsers:
try {
   explore_script.src = chrome.runtime.getURL("z1-explore-hotkey-script.js");
} catch {
   // firefox and safari browsers:
   try {
      explore_script.src = browser.runtime.getURL("z1-explore-hotkey-script.js");
   }
   catch (e) {
      console.log(e);
      alert("Sorry, your browser's method of accessing an extension's \
         web-accessible resources is not supported.");
   }
}

explore_script.onload = function () {
   this.remove();
};
(document.head || document.documentElement).appendChild(explore_script);