import React from "react";

export function HeatMap() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "black solid 4px",
      borderRadius: "8px",
      width: "100%",        // takes up width of its parent container
      overflow: "hidden",   // keeps image from spilling out
    }}>
      <img
        src="../../../images/heatmap.png"
        alt="Exercise heatmap"
        style={{
          width: "100%",      // scales with the container
          height: "auto",     // maintains aspect ratio
          display: "block",   // removes weird inline spacing
        }}
      />
    </div>
  );
}