import React, { useRef, useMemo, Suspense, createElement as h, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox as DreiRoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * NOTE: visual-edits babel plugin stamps x-line-number/x-file-name on all JSX
 * tags. R3F's reconciler interprets dashed props as nested property access
 * (e.g. position-x={1}) which crashes for 'x-line-number'. So all R3F
 * primitives/components are created via React.createElement to avoid the
 * babel stamp.
 */

// Draw the full card face onto a given canvas context
function drawCardFace(ctx, W, H, { number, holder, expiry }) {
    // Clear
    ctx.clearRect(0, 0, W, H);

    // Base gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#032218");
    grad.addColorStop(0.5, "#063a2a");
    grad.addColorStop(1, "#02130d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Soft radial highlight
    const radial = ctx.createRadialGradient(W * 0.25, H * 0.25, 10, W * 0.25, H * 0.25, W * 0.6);
    radial.addColorStop(0, "rgba(52, 211, 153, 0.28)");
    radial.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);

    // Diagonal glow strip (bottom-right)
    ctx.save();
    ctx.translate(W * 0.65, H * 0.85);
    ctx.rotate(-0.32);
    const strip = ctx.createLinearGradient(-400, 0, 400, 0);
    strip.addColorStop(0, "rgba(16,185,129,0)");
    strip.addColorStop(0.5, "rgba(16,185,129,0.22)");
    strip.addColorStop(1, "rgba(16,185,129,0)");
    ctx.fillStyle = strip;
    ctx.fillRect(-500, -50, 1000, 100);
    ctx.restore();

    // Subtle grain dots
    for (let i = 0; i < 250; i++) {
      ctx.fillStyle = `rgba(167, 243, 208, ${Math.random() * 0.04})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top-left: brand
    ctx.fillStyle = "rgba(167, 243, 208, 0.75)";
    ctx.font = "500 22px Outfit, sans-serif";
    ctx.textBaseline = "top";
    ctx.letterSpacing = "4px";
    ctx.fillText("VERDANT · PAY", 60, 60);

    ctx.fillStyle = "rgba(167, 243, 208, 0.45)";
    ctx.font = "500 16px Outfit, sans-serif";
    ctx.fillText("PLATINUM", 60, 90);

    // Top-left accent line
    ctx.fillStyle = "#34d399";
    ctx.fillRect(60, 130, 220, 3);

    // Top-right: logo "VERDANT"
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 900 72px Outfit, sans-serif";
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(16,185,129,0.55)";
    ctx.shadowBlur = 16;
    ctx.textAlign = "right";
    ctx.fillText("VERDANT", W - 60, 52);
    ctx.restore();

    // Contactless icon (arcs) near chip area
    ctx.save();
    ctx.strokeStyle = "rgba(154, 230, 180, 0.85)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(255, 270, 16 + i * 14, -Math.PI * 0.18, Math.PI * 0.18);
      ctx.stroke();
    }
    ctx.restore();

    // Card number
    ctx.fillStyle = "#ecfdf5";
    ctx.font = "500 58px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    ctx.fillText(number, 60, 430);
    ctx.shadowBlur = 0;

    // Labels bottom
    ctx.fillStyle = "rgba(110, 231, 183, 0.65)";
    ctx.font = "600 18px Outfit, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText("CARDHOLDER", 60, 500);
    ctx.fillText("EXPIRES", 680, 500);

    // Values
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 32px Outfit, sans-serif";
    ctx.fillText(holder, 60, 528);
    ctx.fillText(expiry, 680, 528);
}

function useCardTexture({ number, holder, expiry }) {
  const texture = useMemo(() => {
    const W = 1024;
    const H = 640;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    drawCardFace(ctx, W, H, { number, holder, expiry });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.needsUpdate = true;

    // If fonts aren't ready yet, redraw once they are
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        drawCardFace(ctx, W, H, { number, holder, expiry });
        tex.needsUpdate = true;
      });
      // Also try to load specific fonts
      try {
        Promise.all([
          document.fonts.load("600 32px Outfit"),
          document.fonts.load("italic 900 72px Outfit"),
          document.fonts.load("500 58px JetBrains Mono"),
          document.fonts.load("500 22px Outfit"),
          document.fonts.load("600 18px Outfit"),
        ]).then(() => {
          drawCardFace(ctx, W, H, { number, holder, expiry });
          tex.needsUpdate = true;
        });
      } catch (_) {}
    }

    return tex;
  }, [number, holder, expiry]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Card({ number, holder, expiry }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const idleY = Math.sin(t * 0.5) * 0.08;
    const idleX = Math.cos(t * 0.35) * 0.06;

    const mx = state.pointer.x;
    const my = state.pointer.y;

    target.current.y = idleY + mx * 0.4;
    target.current.x = -idleX - my * 0.3;

    group.current.rotation.y += (target.current.y - group.current.rotation.y) * Math.min(1, delta * 4);
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * Math.min(1, delta * 4);
    group.current.position.y = Math.sin(t * 0.9) * 0.06;
  });

  const cardMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#021a12"),
        metalness: 0.6,
        roughness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.25,
      }),
    []
  );

  const faceTexture = useCardTexture({ number, holder, expiry });

  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: faceTexture,
        roughness: 0.45,
        metalness: 0.35,
      }),
    [faceTexture]
  );

  // Card body
  const body = h(DreiRoundedBox, {
    args: [3.2, 2.0, 0.08],
    radius: 0.14,
    smoothness: 8,
    material: cardMat,
  });

  // Face plane with texture
  const face = h(
    "mesh",
    { position: [0, 0, 0.045] },
    h("planeGeometry", { args: [3.15, 1.95] }),
    h("primitive", { object: faceMat, attach: "material" })
  );

  // Gold chip (on top of texture since texture doesn't include chip well)
  const chipBody = h(
    DreiRoundedBox,
    { args: [0.42, 0.32, 0.01], radius: 0.05, smoothness: 4, position: [-1.05, 0.25, 0.052] },
    h("meshPhysicalMaterial", {
      color: "#c8a24a",
      metalness: 1,
      roughness: 0.28,
    })
  );

  const chipLines = [-0.08, 0.0, 0.08].map((y, i) =>
    h(
      "mesh",
      { key: i, position: [-1.05, 0.25 + y, 0.058] },
      h("planeGeometry", { args: [0.38, 0.015] }),
      h("meshStandardMaterial", {
        color: "#8a6a24",
        metalness: 0.9,
        roughness: 0.3,
      })
    )
  );

  // Specular reflection sheen (top-left diagonal highlight)
  const shine = h(
    "mesh",
    { position: [-0.7, 0.6, 0.047], rotation: [0, 0, -0.4] },
    h("planeGeometry", { args: [2.8, 0.25] }),
    h("meshBasicMaterial", {
      color: "#ffffff",
      transparent: true,
      opacity: 0.04,
    })
  );

  return h(
    "group",
    { ref: group, rotation: [-0.05, 0.2, 0] },
    body,
    face,
    shine,
    chipBody,
    ...chipLines
  );
}

function Scene({ number, holder, expiry }) {
  return h(
    React.Fragment,
    null,
    h("ambientLight", { intensity: 0.8 }),
    h("directionalLight", {
      position: [3, 4, 5],
      intensity: 1.4,
      color: "#a7f3d0",
    }),
    h("directionalLight", {
      position: [-4, -2, 3],
      intensity: 0.5,
      color: "#10b981",
    }),
    h("pointLight", {
      position: [0, 0, 3],
      intensity: 0.8,
      color: "#34d399",
    }),
    h(
      Suspense,
      { fallback: null },
      h(Card, { number, holder, expiry })
    )
  );
}

export default function PaymentCard3D({ number, holder, expiry }) {
  return (
    <div
      className="relative w-full h-full rounded-3xl glass overflow-hidden"
      data-testid="payment-card-3d"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 60%, rgba(16,185,129,0.28) 0%, transparent 70%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene number={number} holder={holder} expiry={expiry} />
      </Canvas>

      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-emerald-100/50 z-10">
        <span>Live preview</span>
        <span>Move mouse to tilt</span>
      </div>
    </div>
  );
}
