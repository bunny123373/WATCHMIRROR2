import React from "react";
import CircleLoader from "@/components/CircleLoader";

export default function Loading() {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircleLoader size={80} thickness={5} color="secondary" />
    </div>
  );
}
