import React from "react";

const StatusMessage = ({ status }) => {
  if (!status?.text) {
    return null;
  }

  const isError = status.type === "error";
  const styles = {
    marginTop: "12px",
    padding: "10px 14px",
    borderRadius: "8px",
    color: isError ? "#c62828" : "#1b5e20",
    backgroundColor: isError ? "#fdecea" : "#e8f5e9",
    border: `1px solid ${isError ? "#f5c0c0" : "#c8e6c9"}`,
    fontSize: "14px",
  };

  return <div style={styles}>{status.text}</div>;
};

export default StatusMessage;

