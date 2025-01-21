import React, { useState } from "react";

const DecryptionModal = ({ isOpen, onClose, onDecrypt }) => {
  const [key, setKey] = useState("");

  const handleDecrypt = () => {
    onDecrypt(key);
    setKey("");  
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Decryption Key</h2>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your secret key"
        />
        <button onClick={handleDecrypt}>Decrypt</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DecryptionModal;
