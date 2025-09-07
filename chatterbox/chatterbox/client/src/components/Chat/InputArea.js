// src/components/Chat/InputArea.js
// import React from "react";
// import { FaPaperPlane } from "react-icons/fa";

// const InputArea = ({ value, onChange, onSendMessage }) => {
//   const handleSend = () => {
//     if (!value || !value.trim()) return;
//     onSendMessage && onSendMessage(value.trim());
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="w-full flex items-center px-3 py-2 bg-[#f0f2f5] border-t border-gray-300">
//       {/* Input Box */}
//       <textarea
//         rows={1}
//         className="flex-1 h-50 bg-white rounded-full px-4 outline-none text-sm"
//         // className="flex-1 resize-none bg-white rounded-lg px-3 py-2 outline-none text-sm max-h-32 overflow-y-auto"
//         placeholder="Type a message"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onKeyDown={handleKeyPress}
//       />

//       {/* Send Button */}
//       <button
//         // className="ml-2 text-blue-500 text-xl hover:text-blue-600"

//         className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full flex items-center justify-center"
//         style={{ width: "40px", height: "40px" }}
//         onClick={handleSend}
//       >
//         <FaPaperPlane />
//       </button>
//     </div>
//   );
// };

// export default InputArea;

import React, { useState } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";
import "./InputArea.css";

const InputArea = ({ value, onChange, onSendMessage }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSend = () => {
    if (!value.trim() && !selectedFile) return;
    onSendMessage && onSendMessage(value.trim(), selectedFile);
    onChange && onChange("");
    setSelectedFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    onChange && onChange(value + emoji);
    setShowEmoji(false);
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedFile(e.target.files[0]);
  //   }
  // };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Input box me image preview text
      onChange && onChange(value + ` [Image: ${e.target.files[0].name}]`);
    }
  };

  return (
    <div className="input-area-wrapper">
      <div className="input-area">
        {/* Emoji Button */}
        <div className="relative">
          <button className="icon-btn" onClick={() => setShowEmoji(!showEmoji)}>
            <FaSmile />
          </button>
          {showEmoji && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </div>

        {/* File Upload Icon */}
        <label className="icon-btn">
          <FaPaperclip />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Input Textarea */}
        <textarea
          rows={1}
          className="message-input"
          placeholder="Type a message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* Send Button */}
        <button className="send-btn-circle" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
