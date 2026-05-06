"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#020617] flex items-center justify-center">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E293B_0%,#0F172A_45%,#020617_100%)]" />

      {/* Aurora Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[160px] animate-pulse" />

      {/* Bottom Glow */}
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-[140px]" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Animated Rings */}
        <div className="relative flex items-center justify-center">

          {/* Outer Ring */}
          <div className="absolute w-40 h-40 rounded-full border border-emerald-400/10 animate-spin-slow" />

          {/* Middle Ring */}
          <div className="absolute w-28 h-28 rounded-full border border-white/5 animate-reverse-spin" />

          {/* Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />

          {/* Logo Card */}
          <div className="relative w-24 h-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(16,185,129,0.15)] flex items-center justify-center">

            {/* Inner Shine */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />

            {/* Logo */}
            <img
              src="/logo.svg"
              alt="Net Pay"
              className="relative z-10 w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="mt-10 text-3xl font-semibold tracking-[0.2em] text-white">
          NET PAY
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-white/50 tracking-wide">
          Securing your financial workspace
        </p>

        {/* Progress Bar */}
        <div className="relative mt-10 w-72 h-[4px] rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.03]">

          {/* Glow Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Animated Loader */}
          <div className="absolute top-0 left-[-40%] h-full w-[40%] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-loader shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Loading Text */}
        <div className="mt-5 flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Initializing Secure Session
        </div>

      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes loader {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(350%);
          }
        }

        .animate-loader {
          animation: loader 2s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 14s linear infinite;
        }

        @keyframes reverseSpin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-reverse-spin {
          animation: reverseSpin 10s linear infinite;
        }
      `}</style>
    </div>
  );
}