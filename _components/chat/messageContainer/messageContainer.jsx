"use client";
import { useEffect, useRef } from 'react';
import style from './messageContainer.module.css';

export default function MessageContainer({ messages = [], isLoading = false, hasActiveChat = false }) {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    
    const renderContent = () => {
        // Sin chat seleccionado → pantalla de bienvenida
        if (!hasActiveChat) {
            return (
                <div className={style.empty}>
                    <h1 className={style.welcomeTitle}>
                        ¿Qué deseas <span className={style.highlight}>aprender</span> hoy?
                    </h1>
                    <p className={style.welcomeSubtitle}>
                        Tu asistente académico inteligente para investigación y estudio profundo.
                    </p>
                </div>
            );
        }

        // Cargando mensajes del chat seleccionado
        if (isLoading) {
            return (
                <div className={style.empty}>
                    <p className={style.welcomeSubtitle}>Cargando mensajes...</p>
                </div>
            );
        }

        // Chat seleccionado pero sin mensajes aún
        if (messages.length === 0) {
            return (
                <div className={style.empty}>
                    <p className={style.welcomeSubtitle}>Inicia la conversación enviando un mensaje.</p>
                </div>
            );
        }

        // Mensajes del chat
        return messages.map((msg, index) => (
            <div
                key={msg.id ?? index}
                className={`${style.message} ${msg.sender === 'user' ? style.user : style.bot}`}
            >
                {msg.text}
            </div>
        ));
    };
    
    return (
        <div className={style.container} ref={containerRef}>
            <div className={style.messagesWrapper}>
                {renderContent()}
            </div>
        </div>
    );
}