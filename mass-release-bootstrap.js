var mass_release_script = document.createElement("script");
// chromium-based browsers:
try {
    mass_release_script.src = chrome.runtime.getURL("mass-release-script.js");
} catch {
    // firefox and safari browsers:
    try {
        mass_release_script.src = browser.runtime.getURL("mass-release-script.js");
    }
    catch (e) {
        console.log(e);
        alert("Sorry, your browser's method of accessing an extension's \
         web-accessible resources is not supported.");
    }
}

mass_release_script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(mass_release_script);