import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
	getPaneScrollState,
	savePaneScrollState,
} from "../../../../../../../state/paneScrollStateCache";

/**
 * Markdown preview panes unmount when the user switches tabs. The rendered
 * document owns its own scroll container, so unlike CodeView nothing else
 * saves or restores its position. Restore once per key on mount, then reassert
 * after layout settles because the renderer can add height after first paint.
 */
export function useMarkdownPreviewScroll({
	containerRef,
	scrollStateKey,
	enabled = true,
}: {
	containerRef: RefObject<HTMLDivElement | null>;
	scrollStateKey: string;
	enabled?: boolean;
}): { onScroll: () => void } {
	const restoredKeyRef = useRef<string | null>(null);

	useEffect(() => {
		if (!enabled || restoredKeyRef.current === scrollStateKey) return;
		const container = containerRef.current;
		if (!container) return;
		const saved = getPaneScrollState(scrollStateKey);
		if (!saved) return;
		restoredKeyRef.current = scrollStateKey;
		container.scrollTop = saved.scrollTop;
		container.scrollLeft = saved.scrollLeft;
		if (typeof requestAnimationFrame !== "function") return;
		const frame = requestAnimationFrame(() => {
			if (containerRef.current !== container) return;
			container.scrollTop = saved.scrollTop;
			container.scrollLeft = saved.scrollLeft;
		});
		return () => cancelAnimationFrame(frame);
	}, [containerRef, scrollStateKey, enabled]);

	const onScroll = useCallback(() => {
		if (!enabled) return;
		const container = containerRef.current;
		if (!container) return;
		savePaneScrollState(scrollStateKey, {
			scrollTop: container.scrollTop,
			scrollLeft: container.scrollLeft,
		});
	}, [containerRef, scrollStateKey, enabled]);

	return { onScroll };
}
