import type { ChangesOpenTarget } from "renderer/stores/settings";

/**
 * The sidebar's click policy passes `false` for an ordinary file click. The
 * "Changes open target" setting must still win on that path, otherwise the
 * first click splits the active tab even when the user chose "New tab".
 */
export function shouldOpenDiffInNewTab(
	requested: boolean | undefined,
	changesOpenTarget: ChangesOpenTarget,
): boolean {
	return requested === true || changesOpenTarget === "tab";
}
