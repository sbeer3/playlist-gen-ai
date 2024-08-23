import React from 'react';
import './App.css';

function Modal({ show, words, onClose, onWordSelect }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Select Keywords</h2>
        <div className="modal-bubbles">
          {words.map((word, index) => (
            <div
              key={index}
              className={`modal-bubble ${word.selected ? 'selected' : ''}`}
              onClick={() => onWordSelect(word.text)}
            >
              {word.text}
            </div>
          ))}
        </div>
        <button className="modal-close-button" onClick={onClose}>
          Generate Playlist
        </button>
      </div>
    </div>
  );
}

export default Modal;