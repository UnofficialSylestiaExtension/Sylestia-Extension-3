// Use a mutation observer to call the colorize script whenever new pets are loaded
// node that is updated when new pets loaded
// nuturing grounds (non-null) or pet profile (null)
const nurturing_grounds = document.getElementById("div_nurture_results");
const nurture_results = nurturing_grounds ? nurturing_grounds : document.getElementById("div_nurture");

// callback function 
function colorize_needs() {
	const hatchling = "This Hatchling is ";
	const eggling = "This Eggling is ";
	for(const e of nurture_results.getElementsByTagName("div")) {
		if (e.childNodes.length === 1) {
			if (e.innerHTML.startsWith(hatchling)) {
				// remove 'This Hatchling is' and end period
				let need = e.innerHTML.substring(hatchling.length).replace(".", "");
				need = need.toLowerCase();
                e.textContent = hatchling;
                let span = document.createElement("span");
                span.textContent = need;
                span.className = "nurture_" + need;
                e.appendChild(span);
                e.appendChild(document.createTextNode("."));
			} else if (e.innerHTML.startsWith(eggling)) {
				// remove 'This Eggling is' and end period
				let need = e.innerHTML.substring(eggling.length).replace(".", "");
				need = need.toLowerCase();
				e.textContent = eggling;
                let span = document.createElement("span");
                span.textContent = need;
                span.className = "nurture_" + need;
                e.appendChild(span);
                e.appendChild(document.createTextNode("."));
			}
		} 
	}
}
if (nurturing_grounds) {
    // options for the observer
    const config = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(colorize_needs);
    // start observing the node
    observer.observe(nurture_results, config);
}

// also call the colorizing function when we arrive, if pets are already loaded (i.e. player link)
// (also individual pet pages)
colorize_needs();
