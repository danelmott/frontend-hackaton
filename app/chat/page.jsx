"use client";

import { useState } from "react";
import ChatInput from "@/_components/chat/chatInput/chatInput";
import MessageContainer from "@/_components/chat/messageContainer/messageContainer";
import style from "./page.module.css";

export default function Page() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (text) => {
        // Obviamente aquí reemplazarías el bot con una llamada a tu API real
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        
        // Simular respuesta del bot para ver cómo funciona el layout
        setTimeout(() => {
            setMessages(prev => [...prev, { text: "Esta es una respuesta simulada de la IA.", sender: 'bot' }]);
        }, 1000);
    };
    
    return (
        <div className={style.chatPage}>
            <MessageContainer messages={messages} />
            <div className={style.inputWrapper}>
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}