'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetcher } from '@/_api/fetcher';
import { useAuth } from '@/_contexts/authContext';

const ChatContext = createContext(null);

function mapMessage(msg) {
    return {
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'USER' ? 'user' : 'bot',
    };
}

export function ChatProvider({ children }) {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const loadChats = useCallback(async () => {
        if (!user) {
            setChats([]);
            return;
        }

        setIsLoadingChats(true);
        try {
            const data = await fetcher('/chats');
            setChats(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando chats:', error);
            setChats([]);
        } finally {
            setIsLoadingChats(false);
        }
    }, [user]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    const loadMessages = useCallback(async (chatId) => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        setIsLoadingMessages(true);
        try {
            const chat = await fetcher(`/chats/${chatId}`);
            setMessages((chat.messages ?? []).map(mapMessage));
        } catch (error) {
            console.error('Error cargando mensajes:', error);
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    const handleSelectChat = useCallback(
        (chat) => {
            setActiveChat(chat);
            loadMessages(chat.id);
        },
        [loadMessages]
    );

    const handleCreateNewChat = useCallback(async () => {
        try {
            const newChat = await fetcher('/chats', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Nuevo chat',
                    mode: 'CLIENT',
                }),
            });
            setChats((prev) => [newChat, ...prev]);
            handleSelectChat(newChat);
            return newChat;
        } catch (error) {
            console.error('Error creando chat:', error);
            throw error;
        }
    }, [handleSelectChat]);

    const handleSendMessage = useCallback(
        async (text) => {
            if (!text.trim()) return;

            let chat = activeChat;
            if (!chat) {
                chat = await handleCreateNewChat();
            }

            const optimisticUser = {
                id: `temp-user-${Date.now()}`,
                text,
                sender: 'user',
            };
            setMessages((prev) => [...prev, optimisticUser]);
            setIsSending(true);

            try {
                const data = await fetcher(`/messages/${chat.id}`, {
                    method: 'POST',
                    body: JSON.stringify({ prompt: text }),
                });

                setMessages((prev) => [
                    ...prev.filter((m) => m.id !== optimisticUser.id),
                    mapMessage(data.userMessage),
                    mapMessage(data.assistantMessage),
                ]);

                setChats((prev) => {
                    const updated = prev.map((c) =>
                        c.id === chat.id ? { ...c, updatedAt: new Date().toISOString() } : c
                    );
                    return updated.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );
                });
            } catch (error) {
                setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
                console.error('Error enviando mensaje:', error);
                throw error;
            } finally {
                setIsSending(false);
            }
        },
        [activeChat, handleCreateNewChat]
    );

    const removeChat = useCallback((chatId) => {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChat?.id === chatId) {
            setActiveChat(null);
            setMessages([]);
        }
    }, [activeChat]);

    const updateChatInList = useCallback((updatedChat) => {
        setChats((prev) =>
            prev.map((c) => (c.id === updatedChat.id ? { ...c, ...updatedChat } : c))
        );
        if (activeChat?.id === updatedChat.id) {
            setActiveChat((prev) => ({ ...prev, ...updatedChat }));
        }
    }, [activeChat]);

    const value = useMemo(
        () => ({
            chats,
            activeChat,
            messages,
            isLoadingChats,
            isLoadingMessages,
            isSending,
            loadChats,
            handleSelectChat,
            handleCreateNewChat,
            handleSendMessage,
            removeChat,
            updateChatInList,
        }),
        [
            chats,
            activeChat,
            messages,
            isLoadingChats,
            isLoadingMessages,
            isSending,
            loadChats,
            handleSelectChat,
            handleCreateNewChat,
            handleSendMessage,
            removeChat,
            updateChatInList,
        ]
    );

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat debe usarse dentro de <ChatProvider>');
    }
    return context;
}
