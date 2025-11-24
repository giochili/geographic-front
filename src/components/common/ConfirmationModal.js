import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "დიახ",
  cancelText = "არა"
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Backdrop */}
      <div className="modal-backdrop" onClick={onCancel}></div>
      
      {/* Modal Content */}
      <div className="modal-container">
        <div className="modal-content">
          <p className="modal-message">{message}</p>
          <div className="modal-buttons">
            <button 
              className="modal-button modal-button-confirm" 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button 
              className="modal-button modal-button-cancel" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;

