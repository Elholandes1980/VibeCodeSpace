/**
 * app/(frontend)/(public)/[locale]/fitness/loading.tsx
 *
 * Loading skeleton for the fitness page with iOS-style design.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/fitness/page.tsx
 */

export default function FitnessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0c1d] via-[#1a1a2e] to-[#16213e]">
      <div className="max-w-md mx-auto p-5 space-y-4 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-7 w-36 bg-white/10 rounded mt-2" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="h-7 w-8 bg-white/10 rounded" />
              <div className="h-3 w-16 bg-white/5 rounded mt-1" />
            </div>
          ))}
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Cards skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="w-14 h-14 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-3 w-48 bg-white/5 rounded" />
              <div className="h-3 w-20 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
