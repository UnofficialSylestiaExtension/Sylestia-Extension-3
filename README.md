# Sylestia-Extension-3
Accessibility and Quality-of-Life browser extension for the pet site game Sylestia.com


While the extension is still unverified, you can install an unverified version of this extension.
You will need to either download the correct `.zip` file for your browser, or all of the code in the repository.

 - `firefox.zip` should work for Firefox and Safari
 - `chrome.zip` should work for Chromium-based browsers (Chrome, Edge, Opera)

## Firefox:
Go to `about:debugging` and click on "This Firefox" in the sidebar. Under "Temporary Extensions" choose "Load Temporary Add-on..." and select either `firefox.zip` or any code file (`manifest.json`, `colorize-nurture.js`, etc.). If you choose a code file, you will have to first un-comment out the `"browser_specific_settings"` section in `manifest.json`.

You will then need to give the add-on permissions once you go to Sylestia.com. At the top right, the plugin icon should have a notification asking for permissions for the Sylestia Extension 3.

Unfortunately, since unverified add-ons can only be added as temporary extensions (as far as I know--I could be wrong), this extension will be removed every time you restart Firefox.

## Chrome:
For Chrome, you will currently need to download the unzipped files (or download `chrome.zip` and unzip it).
Go to `chrome://extensions` and on the top right turn on the "Developer Mode" toggle. A few buttons will appear. Click "Load Unpacked" and select the `Sylestia-Extension-3` folder that contains the repository/code.
