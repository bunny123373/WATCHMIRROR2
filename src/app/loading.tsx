export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#F5C542] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#9CA3AF] text-sm">Loading...</p>
      </div>
    </div>
  );
}
