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

function WelcomeEmpty({ pre, highlight, post = "", subtitle }) {
    return (
        <div className={style.empty}>
            <h1 className={style.welcomeTitle}>
                {pre} <span className={style.highlight}>{highlight}</span>
                {post}
            </h1>
            <p className={style.welcomeSubtitle}>{subtitle}</p>
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
                <WelcomeEmpty
                    pre="¿Qué deseas"
                    highlight="financiar"
                    post=" hoy?"
                    subtitle="Tu asistente inteligente de Serfinanzas para presupuestos, ahorro, créditos e inversiones."
                />
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
                <WelcomeEmpty
                    pre="¿En qué te ayudamos con tus"
                    highlight="finanzas"
                    post="?"
                    subtitle="Consulta sobre ahorro, presupuesto, metas financieras o productos de Serfinanzas. Escribe tu primera pregunta abajo."
                />
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
