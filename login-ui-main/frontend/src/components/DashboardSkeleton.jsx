import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-strong rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-4 w-20 rounded-lg bg-emerald-500/15" />
              <Skeleton className="h-8 w-8 rounded-lg bg-emerald-500/20" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg bg-emerald-500/25" />
            <Skeleton className="mt-2 h-3 w-20 rounded-lg bg-emerald-500/15" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-2xl p-6">
          <Skeleton className="h-5 w-32 rounded-lg bg-emerald-500/15 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full bg-emerald-500/30" />
                <Skeleton className="h-4 w-24 rounded-lg bg-emerald-500/15" />
                <Skeleton className="h-3 w-12 rounded-lg bg-emerald-500/10 ml-auto" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <Skeleton className="h-5 w-32 rounded-lg bg-emerald-500/15 mb-6" />
          <div className="h-48">
            <Skeleton className="h-full w-full rounded-lg bg-emerald-500/20" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-strong rounded-2xl p-6">
        <Skeleton className="h-5 w-32 rounded-lg bg-emerald-500/15 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              <Skeleton className="h-10 w-10 rounded-lg bg-emerald-500/20" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 rounded-lg bg-emerald-500/15 mb-2" />
                <Skeleton className="h-3 w-24 rounded-lg bg-emerald-500/10" />
              </div>
              <Skeleton className="h-4 w-20 rounded-lg bg-emerald-500/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
