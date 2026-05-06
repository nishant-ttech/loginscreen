import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PartitionAnimator({ children, activeKey }) {
  const child = React.Children.only(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKey = useRef(activeKey);

  useEffect(() => {
    if (activeKey === prevKey.current) return;
    setIsTransitioning(true);
    const doneT = setTimeout(() => {
      setIsTransitioning(false);
      prevKey.current = activeKey;
    }, 550);
    return () => clearTimeout(doneT);
  }, [activeKey]);

  return (
    <div className="relative" data-testid="partition-animator">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          {child}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="overlay"
            className="absolute inset-0 pointer-events-none rounded-[28px] overflow-hidden"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.12, opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeIn" }}
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.20) 0%, rgba(5,46,31,0.40) 60%, rgba(16,185,129,0.15) 100%)",
              border: "1px solid rgba(16,185,129,0.25)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px -8px rgba(16,185,129,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
