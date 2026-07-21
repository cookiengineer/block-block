
function fixStylesheet(style_element) {

	if (style_element.textContent) {

		let text_content = style_element.textContent;

		text_content = text_content.replace(/overflow\s*:\s*hidden\s*!important/g, 'overflow: auto !important');

		// Filters
		text_content = text_content.replace(/backdrop-filter\s*:[^;]+;/g, '');
		text_content = text_content.replace(/filter\s*:[^;]+;/g, '');

		// Pointer Events
		text_content = text_content.replace(/pointer-events\s*:\s*none\s*!important/g, 'pointer-events: auto !important');
		text_content = text_content.replace(/pointer-events\s*:\s*none\s*;/g, 'pointer-events: auto !important;');

		// Touch Actions
		text_content = text_content.replace(/touch-action\s*:\s*none\s*!important/g, 'touch-action: auto !important');
		text_content = text_content.replace(/touch-action\s*:\s*none\s*;/g, 'touch-action: auto !important;');

		// Visibility
		text_content = text_content.replace(/visibility\s*:\s*hidden\s*!important/g, 'visibility: visible !important');
		text_content = text_content.replace(/visibility\s*:\s*hidden\s*;/g, 'visibility: visible !important;');

		style_element.textContent = text_content;

	}

}

function removeClasses(element) {

	for (let c = 0; c < element.classList.length; c++) {

		let classname = element.classList[c];
		if (classname.includes("scroll")) {
			element.classList.remove(classname);
		} else if (classname.includes("modal-open") || classname.includes("modal-active")) {
			element.classList.remove(classname);
		}

	}

}

function removeOverflow(element, computed) {

	const computed_style = getComputedStyle(element);

	if (element.style["overflow"] === "hidden") {
		element.style.setProperty("overflow", "auto", "important");
	} else if computed_style.getPropertyValue("overflow") === "hidden") {
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

function removeTouchAction(element) {

	const computed_style = getComputedStyle(element);

	if (element.style["touchAction"] === "none" || computed_style.getPropertyValue("touch-action") !== "auto") {
		element.style.setProperty("touch-action", "auto", "important");
	}

}

function removeVisibility(element) {

	const computed_style = getComputedStyle(element);

	if (element.style["visibility"] === "hidden" || computed_style.getPropertyValue("visibility") === "hidden") {
		element.style.setProperty("visibility", "visible", "important");
	}

}

async function getEnabled() {
	let result = await browser.storage.local.get("enabled");
	return result.enabled === true;
}


getEnabled().then((enabled) => {

	if (enabled === true) {

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

				removeClasses(element);
				removeOverflow(element);
				removeFilters(element);
				removePointerEvents(element);
				removeTouchAction(element);
				removeVisibility(element);

			});

		});

		// Remove dynamic CSS properties
		new MutationObserver((mutations) => {

			for (const mutation of mutations) {

				if (mutation.type === "attributes") {

					removeClasses(mutation.target);
					removeOverflow(mutation.target);
					removeFilters(mutation.target);
					removePointerEvents(mutation.target);
					removeTouchAction(mutation.target);
					removeVisibility(mutation.target);

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

	}

});
