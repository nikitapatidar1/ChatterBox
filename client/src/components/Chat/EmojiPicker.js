import React from 'react';
import './EmojiPicker.css';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭', '🤫', '🤥', '😶', '🫠', '😐', '🫤', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

const EmojiPicker = ({ onSelect, onClose }) => {
  const handleEmojiClick = (emoji) => {
    onSelect(emoji);
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <h3>Emojis</h3>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="emoji-grid">
        {emojis.map(emoji => (
          <span
            key={emoji}
            className="emoji"
            onClick={() => handleEmojiClick(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;