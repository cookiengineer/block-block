
let block_block_enabled = true;

function updateIcon(enabled) {

	let icon16  = enabled ? "icons/icon16.png"  : "icons/icon16-disabled.png";
	let icon48  = enabled ? "icons/icon48.png"  : "icons/icon48-disabled.png";
	let icon128 = enabled ? "icons/icon128.png" : "icons/icon128-disabled.png";

	browser.browserAction.setIcon({
		path: {
			16:  icon16,
			48:  icon48,
			128: icon128
		}
	});

	browser.browserAction.setTitle({
		title: enabled ? "Block Block (active)" : "Block Block (disabled)"
	});

}

browser.storage.local.get("enabled").then((result) => {

	if (typeof result.enabled === "boolean") {
		block_block_enabled = result.enabled;
		updateIcon(block_block_enabled);
	}

});

browser.browserAction.onClicked.addListener(async () => {

	block_block_enabled = !block_block_enabled;

	await browser.storage.local.set({
		enabled: block_block_enabled
	});

	updateIcon(block_block_enabled);

});

