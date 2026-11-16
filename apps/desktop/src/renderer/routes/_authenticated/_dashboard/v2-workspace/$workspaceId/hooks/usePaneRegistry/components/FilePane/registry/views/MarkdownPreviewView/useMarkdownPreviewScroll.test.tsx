import { beforeEach, describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import {
	clearPaneScrollStateCache,
	savePaneScrollState,
} from "../../../../../../../state/paneScrollStateCache";
import { useMarkdownPreviewScroll } from "./useMarkdownPreviewScroll";

const KEY = JSON.stringify(["ws-1", null, "markdown", "notes.md"]);

describe("useMarkdownPreviewScroll", () => {
	beforeEach(() => {
		clearPaneScrollStateCache();
	});

	it("restores the saved scroll position on mount", () => {
		savePaneScrollState(KEY, { scrollTop: 420, scrollLeft: 0 });
		const container = {
			scrollTop: 0,
			scrollLeft: 0,
		} as unknown as HTMLDivElement;
		const containerRef = createRef<HTMLDivElement>();
		Object.defineProperty(containerRef, "current", {
			value: container,
			writable: true,
		});

		renderHook(() =>
			useMarkdownPreviewScroll({ containerRef, scrollStateKey: KEY }),
		);

		expect(container.scrollTop).toBe(420);
	});

	it("saves the current scroll position when the container scrolls", () => {
		const container = {
			scrollTop: 0,
			scrollLeft: 0,
		} as unknown as HTMLDivElement;
		const containerRef = createRef<HTMLDivElement>();
		Object.defineProperty(containerRef, "current", {
			value: container,
			writable: true,
		});

		const { result } = renderHook(() =>
			useMarkdownPreviewScroll({ containerRef, scrollStateKey: KEY }),
		);
		container.scrollTop = 317;
		act(() => {
			result.current.onScroll();
		});

		expect(container.scrollTop).toBe(317);
	});
});
