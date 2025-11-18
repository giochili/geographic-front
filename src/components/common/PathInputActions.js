import React from "react";

const containerStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "6px",
  flexWrap: "wrap",
};

const PathInputActions = ({ onPaste, onClear }) => (
  <div style={containerStyle}>
    <button type="button" onClick={onPaste} title="ჩასმა კლიპბორდიდან">
      ჩასმა
    </button>
    <button type="button" onClick={onClear} title="გასუფთავება">
      გასუფთავება
    </button>
  </div>
);

export default PathInputActions;

