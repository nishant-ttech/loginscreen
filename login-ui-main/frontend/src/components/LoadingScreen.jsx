import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-60" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full bg-emerald-500/20" />
          <Skeleton className="h-8 w-32 rounded-lg bg-emerald-500/15" />
        </div>
        
        {/* Pulse ring */}
        <div className="relative">
          <div className="absolute inset-[-8px] rounded-full bg-emerald-500/20 animate-ping" />
          <div className="absolute inset-[-16px] rounded-full bg-emerald-500/15 animate-ping animation-delay-1000" />
          <Skeleton className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/40 to-emerald-700/30" />
        </div>
        
        {/* Text skeletons */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-48 rounded-lg bg-emerald-500/15" />
          <Skeleton className="h-3 w-36 rounded-lg bg-emerald-500/10" />
        </div>
        
        {/* Progress bar */}
        <div className="w-48">
          <Skeleton className="h-2 w-full rounded-full bg-emerald-500/10" />
          <Skeleton className="mt-1 h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/50" />
        </div>
        
        <style jsx>{`
          @keyframes pulse-delay {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </div>
    </div>
  );
}
