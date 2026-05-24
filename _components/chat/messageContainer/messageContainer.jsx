"use client";
import { useEffect, useRef } from 'react';
import MarkdownRenderer from '@/_components/markdownRender/markdownRender';
import style from './messageContainer.module.css';

function TypingIndicator() {
    return (
        <div className={style.typingIndicator} aria-label="El asistente está escribiendo">
            <span className={style.typingDot} />
            <span className={style.typingDot} />
            <span className={style.typingDot} />
        </div>
    );
}

export default function MessageContainer({ messages = [], isLoading = false, hasActiveChat = false }) {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    
    const renderContent = () => {
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

        if (isLoading) {
            return (
                <div className={style.empty}>
                    <p className={style.welcomeSubtitle}>Cargando mensajes...</p>
                </div>
            );
        }

        if (messages.length === 0) {
            return (
                <div className={style.empty}>
                    <p className={style.welcomeSubtitle}>Inicia la conversación enviando un mensaje.</p>
                </div>
            );
        }

        return messages.map((msg, index) => (
            <div
                key={msg.id ?? index}
                className={`${style.message} ${msg.sender === 'user' ? style.user : style.bot}`}
            >
                {msg.pending ? (
                    <TypingIndicator />
                ) : msg.sender === 'bot' ? (
                    <MarkdownRenderer content={msg.text} variant="chat" />
                ) : (
                    msg.text
                )}
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
