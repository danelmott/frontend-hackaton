"use client";

import { useState, useRef, useEffect } from "react";
import style from "./chatInput.module.css";
import { Icon } from "../../icon/icon";

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
    if (message.trim()) {
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className={style.inputContainer}>
      <button className={`${style.iconButton} ${style.attachButton}`} aria-label="Adjuntar archivo">
        <Icon name="add" size="md" />
      </button>

      <div className={style.textareaWrapper}>
        <textarea
          ref={textareaRef}
          className={style.textarea}
          placeholder="Pregunta lo que quieras"
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
        />
      </div>

      <div className={`${style.actionButtons} ${style.rightButtons}`}>
        {message.trim() ? (
          <button 
            className={`${style.submitButton} ${style.sendAction}`}
            onClick={handleSend}
            aria-label="Enviar mensaje"
          >
            <Icon name="arrow_upward" size="md" />
          </button>
        ) : (
          <div className={style.audioActions}>
            <button className={style.iconButton} aria-label="Micrófono">
              <Icon name="mic" size="md" />
            </button>
            <button 
              className={`${style.submitButton} ${isRecording ? style.recording : ''}`}
              onClick={toggleRecording}
              aria-label="Entrada de voz"
            >
              <Icon name="graphic_eq" size="md" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}