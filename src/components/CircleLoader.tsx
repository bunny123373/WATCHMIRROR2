"use client";

interface CircleLoaderProps {
  size?: number;
  thickness?: number;
  color?: string;
}

export default function CircleLoader({ size = 40, thickness = 4, color = "secondary" }: CircleLoaderProps) {
  const isGold = color === "secondary" || color === "#F5C542";
  const borderColor = isGold ? "#F5C542" : color;

  return (
    <div
      className="m-auto animate-spin rounded-none"
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderStyle: "solid",
        borderColor: `${borderColor}20`,
        borderTopColor: borderColor,
      }}
    />
  );
}
