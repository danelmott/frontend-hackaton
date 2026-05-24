"use client";

import { useEffect, useRef } from 'react';
import style from './messageContainer.module.css';

export default function MessageContainer({ messages = [] }) {
    const containerRef = useRef(null);

    // Auto-scroll hacia abajo cuando llega un nuevo mensaje
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    
    return (
        <div className={style.container} ref={containerRef}>
            <div className={style.messagesWrapper}>
                {messages.length === 0 ? (
                    <div className={style.empty}>
                        <h1 className={style.welcomeTitle}>
                                ¿Qué deseas <span className={style.highlight}>aprender</span> hoy?
                        </h1>
                        <p className={style.welcomeSubtitle}>
                        Tu asistente académico inteligente para investigación y estudio profundo.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`${style.message} ${msg.sender === 'user' ? style.user : style.bot}`}
                        >
                            {msg.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
