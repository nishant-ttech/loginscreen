"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#020617] flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E293B_0%,#0F172A_45%,#020617_100%)]" />

      {/* Animated Aurora */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[180px] animate-pulse" />

      {/* Bottom Glow */}
      <div className="absolute bottom-[-200px] right-[-120px] w-[550px] h-[550px] rounded-full bg-lime-400/10 blur-[180px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo Section */}
        <div className="relative flex items-center justify-center">

          {/* Outer Rotating Ring */}
          <div className="absolute w-[220px] h-[220px] rounded-full border border-emerald-400/10 animate-spin-slow" />

          {/* Dashed Ring */}
          <div className="absolute w-[180px] h-[180px] rounded-full border-[3px] border-transparent border-t-emerald-400/70 border-r-emerald-500/40 animate-spin" />

          {/* Reverse Ring */}
          <div className="absolute w-[150px] h-[150px] rounded-full border border-white/5 animate-reverse-spin" />

          {/* Pulse Glow */}
          <div className="absolute w-[140px] h-[140px] rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />

          {/* Floating Particles */}
          <div className="absolute w-[260px] h-[260px] animate-spin-slower">
            <span className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <span className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-lime-300" />
            <span className="absolute top-12 right-5 w-2 h-2 rounded-full bg-emerald-300" />
          </div>

          {/* Logo Container */}
          <div className="relative w-36 h-36 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(16,185,129,0.25)] flex items-center justify-center overflow-hidden">

            {/* Shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-[2rem] border border-emerald-400/20 animate-pulse" />

            {/* Logo */}
            <img
              src="/net.png"
              alt="Net Pay"
              className="relative z-10 w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(16,185,129,0.6)]"
            />
          </div>
        </div>

        {/* Brand */}
        <div className="mt-10 text-center">

          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-500 to-lime-400">
            NET PAY
          </h1>

          <p className="mt-4 text-sm md:text-base text-white/45 tracking-[0.18em] uppercase">
            Global Payment Service Provider
          </p>

        </div>

        {/* Loader */}
        <div className="relative mt-12 w-80 h-[5px] rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.04]">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Moving Bar */}
          <div className="absolute top-0 left-[-40%] h-full w-[40%] rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-emerald-600 animate-loader shadow-[0_0_25px_rgba(16,185,129,0.7)]" />

        </div>

        {/* Loading Text */}
        <div className="mt-6 flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-white/35">

          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
          </div>

          Initializing Secure Payment Gateway

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

        @keyframes spinSlower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .animate-spin-slower {
          animation: spinSlower 20s linear infinite;
        }
      `}</style>
    </div>
  );
}