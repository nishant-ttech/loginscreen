import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PartitionAnimator
 * - Measures height of active child and locks container during transitions.
 * - On key change, plays a partition-chunk overlay: 6x5 grid (30 chunks) that
 *   moves outward slightly, then snaps back (spring).
 * - Old content fades/blurs out, new content fades/blurs in at midpoint.
 */
const COLS = 6;
const ROWS = 5;
const TOTAL = COLS * ROWS;

export default function PartitionAnimator({ children, activeKey }) {
  const child = React.Children.only(children);
  const wrapRef = useRef(null);
  const measureRef = useRef(null);
  const [height, setHeight] = useState("auto");
  const [shattering, setShattering] = useState(false);
  const [displayed, setDisplayed] = useState(child);
  const prevKey = useRef(activeKey);

  // Update displayed content after first paint
  useEffect(() => {
    if (activeKey === prevKey.current) return;
    // Start animation sequence
    setShattering(true);
    // Swap content at midpoint (~320ms into ~640ms total)
    const swapT = setTimeout(() => setDisplayed(child), 320);
    const doneT = setTimeout(() => {
      setShattering(false);
      prevKey.current = activeKey;
    }, 720);
    return () => {
      clearTimeout(swapT);
      clearTimeout(doneT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  // Measure content height so layout is locked and chunks can overlay
  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const h = measureRef.current.offsetHeight;
    if (h > 0) setHeight(h);
  }, [displayed]);

  // Build grid chunks
  const chunks = Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    // Center-relative direction
    const cx = (col + 0.5) / COLS - 0.5; // -0.5..0.5
    const cy = (row + 0.5) / ROWS - 0.5;
    const mag = Math.max(0.001, Math.hypot(cx, cy));
    // Outward px offset between 10 and 22 based on radial distance
    const push = 10 + mag * 22;
    const dx = (cx / mag) * push;
    const dy = (cy / mag) * push;
    // Small rotation (max ~2deg)
    const rot = (cx + cy) * 2;
    // Stagger based on radial distance (center goes first)
    const delay = 0.012 * (i % COLS) + 0.018 * Math.floor(i / COLS);
    return { i, col, row, dx, dy, rot, delay };
  });

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: typeof height === "number" ? height : undefined }}
      data-testid="partition-animator"
    >
      {/* Actual content (for measurement + display). Invisible while shattering. */}
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
            key={displayed.key || "default"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {displayed}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Chunk overlay – only during shatter */}
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
