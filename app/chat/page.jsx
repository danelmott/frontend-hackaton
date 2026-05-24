"use client";

import ChatInput from "@/_components/chat/chatInput/chatInput";
import MessageContainer from "@/_components/chat/messageContainer/messageContainer";
import QuestionPanel from "@/_components/chat/questionPanel/questionPanel";
import { useChat } from "@/_contexts/chatContext";
import { useProfileQuestions } from "@/_contexts/profileQuestionsContext";
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

    const { applyQuestionsState, shouldShowPanel } = useProfileQuestions();

    const onSendMessage = async (text) => {
        try {
            const data = await handleSendMessage(text);
            if (data?.questionsState) {
                applyQuestionsState(data.questionsState);
            }
        } catch (error) {
            toastApi.error(error.message || "No se pudo enviar el mensaje");
        }
    };

    const onQuestionAnswer = async (_field, _value, data) => {
        if (data?.formattedAnswer) {
            try {
                const response = await handleSendMessage(data.formattedAnswer);
                if (response?.questionsState) {
                    applyQuestionsState(response.questionsState);
                }
            } catch (error) {
                toastApi.error(error.message || "No se pudo enviar la respuesta");
            }
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
                <QuestionPanel
                    onAnswer={onQuestionAnswer}
                    disabled={isSending}
                />
                <ChatInput
                    onSendMessage={onSendMessage}
                    disabled={isSending}
                    placeholder={
                        shouldShowPanel
                            ? "O responde directamente..."
                            : "Pregunta lo que quieras"
                    }
                />
            </div>
        </div>
    );
}
