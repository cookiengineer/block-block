
function fixStylesheet(style_element) {

	if (style_element.textContent) {

		let text_content = style_element.textContent;

		text_content = text_content.replace(/overflow\s*:\s*hidden\s*!important/g, 'overflow: auto !important');
		text_content = text_content.replace(/backdrop-filter\s*:[^;]+;/g, '');
		text_content = text_content.replace(/filter\s*:[^;]+;/g, '');
		text_content = text_content.replace(/pointer-events\s*:\s*none\s*!important/g, 'pointer-events: auto !important');
		text_content = text_content.replace(/pointer-events\s*:\s*none\s*;/g, 'pointer-events: auto !important;');

		style_element.textContent = text_content;

	}

}

function removeOverflow(element, computed) {

	const computed_style = getComputedStyle(element);

	if (element.style["overflow"] === "hidden" || computed_style.getPropertyValue("overflow") !== "auto") {
		element.style.setProperty("overflow", "auto", "important");
	}

}

function removeFilters(element) {

	const computed_style = getComputedStyle(element);

	if (element.style["filter"] || computed_style.getPropertyValue("filter") !== "none") {
		element.style.setProperty("filter", "none", "important");
	}

	if (element.style["backdropFilter"] || computed_style.getPropertyValue("backdrop-filter") !== "none") {
		element.style.setProperty("backdrop-filter", "none", "important");
	}

}

function removePointerEvents(element) {

	const computed_style = getComputedStyle(element);

	if (element.style["pointerEvents"] === "none" || computed_style.getPropertyValue("pointer-events") !== "auto") {
		element.style.setProperty("pointer-events", "auto", "important");
	}

}

// Block event blockers
(() => {

	const blocked_events = [
		"wheel",
		"mousewheel",
		"touchmove",
		"contextmenu"
	];

	blocked_events.forEach((event_name) => {

		window.addEventListener(event_name, (event) => {

			// Allows default behavior
			event.stopImmediatePropagation();

		}, {
			capture: true,
			passive: false
		});

	});

	const original_addEventListener = EventTarget.prototype.addEventListener;

	EventTarget.prototype.addEventListener = function(type, listener, options) {

		if (blocked_events.includes(type) === true) {

			const wrapped_listener = function(event) {

				event.preventDefault = function() {
					// Do Nothing
				};

				return listener.apply(this, arguments);

			};

			return original_addEventListener.call(this, type, wrapped_listener, options);

		} else {
			return original_addEventListener.call(this, type, listener, options);
		}

	};

})();

document.addEventListener("DOMContentLoaded", () => {

	document.documentElement.appendChild(Object.assign(document.createElement("style"), {
		textContent: [
			"* {",
			"\toverflow: auto !important;",
			"\tfilter: none !important;",
			"\tbackdrop-filter: none !important;",
			"\tpointer-events: auto !important;",
			"}"
		].join("\n")
	}));

	// Remove static CSS properties
	document.querySelectorAll("*").forEach((element) => {

		removeOverflow(element);
		removeFilters(element);
		removePointerEvents(element);

	});

});

// Remove dynamic CSS properties
new MutationObserver((mutations) => {

	for (const mutation of mutations) {

		if (mutation.type === "attributes") {
			removeOverflow(mutation.target);
			removeFilters(mutation.target);
			removePointerEvents(mutation.target);
		}

	}

}).observe(document.documentElement, {
	attributes:      true,
	subtree:         true,
	attributeFilter: ["style", "class"]
});

// Remove dynamic style elements
new MutationObserver((mutations) => {

	for (const mutation of mutations) {

		for (const node of mutation.addedNodes) {

			if (node.nodeName === "STYLE") {
				fixStylesheet(node);
			}

		}

	}

}).observe(document.documentElement, {
	childList: true,
	subtree:   true
});



// Remove dynamic event blockers
Object.defineProperty(document, "oncontextmenu", {
	set() {
		// Do Nothing
	},
	get() {
		return null;
	}
});


