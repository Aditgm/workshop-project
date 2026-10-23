export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1280px] animate-pulse px-5 py-16 sm:px-8 sm:py-24"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-2 w-28 rounded-full bg-navy/10" />
      <div className="mt-7 h-14 w-2/3 max-w-2xl rounded-[2px] bg-navy/[0.08]" />
      <div className="mt-4 h-4 w-1/2 max-w-md rounded-[2px] bg-navy/[0.06]" />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="min-h-56 border border-navy/10 bg-navy/[0.025] p-6"
          >
            <div className="h-2 w-10 bg-navy/10" />
            <div className="mt-8 h-8 w-3/4 bg-navy/[0.08]" />
            <div className="mt-4 h-3 w-full bg-navy/[0.05]" />
            <div className="mt-2 h-3 w-5/6 bg-navy/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}
