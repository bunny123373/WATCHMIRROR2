export default function CircleLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />

      <div className="relative flex flex-col items-center gap-6 z-10 animate-fadeIn">
        <h1 className="text-white text-5xl font-bold tracking-[0.25em] drop-shadow-2xl">
          WATCHMIRROR
        </h1>

        <div className="w-40 h-[2px] bg-zinc-800 overflow-hidden rounded-full">
          <div className="h-full w-full bg-white animate-pulse rounded-full" />
        </div>

        <p className="text-zinc-400 text-sm tracking-[0.4em] uppercase">
          Entering Experience
        </p>
      </div>
    </div>
  );
}
