export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1280px] animate-pulse px-5 py-14 sm:px-8 sm:py-20"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-2.5 w-24 rounded-full bg-white/[0.08]" />
      <div className="mt-5 h-12 w-2/3 max-w-xl rounded-2xl bg-white/[0.07]" />
      <div className="mt-4 h-4 w-1/2 max-w-md rounded-lg bg-white/[0.045]" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-[25px] border border-white/10 bg-white/[0.015]"
          >
            <div className="h-48 bg-white/[0.045]" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded-lg bg-white/[0.07]" />
              <div className="h-3 w-full rounded-full bg-white/[0.04]" />
              <div className="h-3 w-5/6 rounded-full bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
