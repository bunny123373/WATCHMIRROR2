export default function CircleLoading() {
  const circles = Array.from({ length: 12 });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-24 h-24">
        {circles.map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-black animate-pulse"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-38px)`,
              transformOrigin: 'center',
              animationDelay: `${i * 0.1}s`,
              opacity: 1 - i * 0.06,
            }}
          />
        ))}
      </div>
    </div>
  );
}
