import React from "react";

export default function Relationship({ value, backgroundColor }) {
  return (
    <span
      style={{
        boxSizing: "border-box",
        backgroundColor: backgroundColor,
        color: "red",
        fontWeight: 400,
        padding: "2px 6px",
        borderRadius: 4,
        textTransform: "capitalize",
        display: "inline-block",
      }}
    >
      {value}
    </span>
  );
}
