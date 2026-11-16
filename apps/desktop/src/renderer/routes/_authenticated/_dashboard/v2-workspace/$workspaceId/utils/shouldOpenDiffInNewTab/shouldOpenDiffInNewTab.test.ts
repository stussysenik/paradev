import { describe, expect, it } from "bun:test";
import { shouldOpenDiffInNewTab } from "./shouldOpenDiffInNewTab";

describe("shouldOpenDiffInNewTab", () => {
	it("honours the Changes open target when the click gives no override", () => {
		expect(shouldOpenDiffInNewTab(undefined, "tab")).toBe(true);
		expect(shouldOpenDiffInNewTab(undefined, "pane")).toBe(false);
	});

	it("lets the Changes open target win over an explicit pane click", () => {
		// The sidebar's click policy passes false by default. Without this the
		// "New tab" setting is ignored on the very first file click (#9039).
		expect(shouldOpenDiffInNewTab(false, "tab")).toBe(true);
	});

	it("still honours an explicit new-tab click", () => {
		expect(shouldOpenDiffInNewTab(true, "pane")).toBe(true);
		expect(shouldOpenDiffInNewTab(true, "tab")).toBe(true);
	});
});
