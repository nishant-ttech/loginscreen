import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PartitionAnimator
 * - Always renders the LATEST child so controlled inputs inside stay in sync
 *   with parent state (typing, autofill, deletion all flow through normally).
 * - When `activeKey` changes, plays a partition-chunk overlay (6x5 grid) and
 *   swaps the underlying content via AnimatePresence keyed on activeKey.
 * - Tracks size via ResizeObserver so dynamic content (e.g. multi-step
 *   wizard) grows/shrinks the glass card cleanly.
 */
const COLS = 6;
const ROWS = 5;
const TOTAL = COLS * ROWS;

export default function PartitionAnimator({ children, activeKey }) {
  const child = React.Children.only(children);
  const measureRef = useRef(null);
  const [height, setHeight] = useState("auto");
  const [shattering, setShattering] = useState(false);
  const prevKey = useRef(activeKey);

  useEffect(() => {
    if (activeKey === prevKey.current) return;
    setShattering(true);
    const doneT = setTimeout(() => {
      setShattering(false);
      prevKey.current = activeKey;
    }, 720);
    return () => clearTimeout(doneT);
  }, [activeKey]);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const h = measureRef.current.offsetHeight;
    if (h > 0) setHeight(h);
  }, [activeKey]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h > 0) setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chunks = Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = (col + 0.5) / COLS - 0.5;
    const cy = (row + 0.5) / ROWS - 0.5;
    const mag = Math.max(0.001, Math.hypot(cx, cy));
    const push = 10 + mag * 22;
    const dx = (cx / mag) * push;
    const dy = (cy / mag) * push;
    const rot = (cx + cy) * 2;
    const delay = 0.012 * (i % COLS) + 0.018 * Math.floor(i / COLS);
    return { i, col, row, dx, dy, rot, delay };
  });

  return (
    <div
      className="relative"
      style={{ height: typeof height === "number" ? height : undefined }}
      data-testid="partition-animator"
    >
      <motion.div
        ref={measureRef}
        animate={{
          opacity: shattering ? 0 : 1,
          filter: shattering ? "blur(2px)" : "blur(0px)",
          scale: shattering ? 0.985 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
        data-testid="partition-content"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {child}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {shattering && (
          <motion.div
            key="shatter"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            data-testid="partition-shatter"
          >
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                gap: 2,
              }}
            >
              {chunks.map(({ i, dx, dy, rot, delay }) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0.9 }}
                  animate={{
                    x: [0, dx, 0],
                    y: [0, dy, 0],
                    rotate: [0, rot, 0],
                    scale: [1, 0.97, 1],
                    opacity: [0.9, 1, 0.0],
                  }}
                  transition={{
                    duration: 0.62,
                    times: [0, 0.45, 1],
                    delay,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="rounded-[6px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(5,46,31,0.32) 60%, rgba(16,185,129,0.10) 100%)",
                    border: "1px solid rgba(16,185,129,0.22)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 18px -6px rgba(16,185,129,0.35)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
