"use client";

import ChatInput from "@/_components/chat/chatInput/chatInput";
import MessageContainer from "@/_components/chat/messageContainer/messageContainer";
import { useChat } from "@/_contexts/chatContext";
import { toastApi } from "@/_contexts/toastContext";
import style from "./page.module.css";

export default function Page() {
    const {
        activeChat,
        messages,
        isLoadingMessages,
        isSending,
        handleSendMessage,
    } = useChat();

    const onSendMessage = async (text) => {
        try {
            await handleSendMessage(text);
        } catch (error) {
            toastApi.error(error.message || "No se pudo enviar el mensaje");
        }
    };

    return (
        <div className={style.chatPage}>
            <MessageContainer
                messages={messages}
                isLoading={isLoadingMessages}
                hasActiveChat={messages.length > 0 || Boolean(activeChat)}
            />
            <div className={style.inputWrapper}>
                <ChatInput onSendMessage={onSendMessage} disabled={isSending} />
            </div>
        </div>
    );
}
