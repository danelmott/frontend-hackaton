"use client";

import { useState, useRef, useEffect } from "react";
import style from "./chatInput.module.css";
import { Icon } from "../../icon/icon";

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Efecto para auto-expandir el textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Crece hasta 200px, luego hace scroll interno
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage?.(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={style.inputContainer}>
      <div className={style.textareaWrapper}>
        <textarea
          ref={textareaRef}
          className={style.textarea}
          placeholder="Pregunta lo que quieras"
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
      </div>

      {message.trim() && (
        <div className={`${style.actionButtons} ${style.rightButtons}`}>
          <button
            className={`${style.submitButton} ${style.sendAction}`}
            onClick={handleSend}
            aria-label="Enviar mensaje"
            disabled={disabled}
          >
            <Icon name="arrow_upward" size="md" />
          </button>
        </div>
      )}
    </div>
  );
}
