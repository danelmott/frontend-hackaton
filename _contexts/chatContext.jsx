'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetcher } from '@/_api/fetcher';
import { useAuth } from '@/_contexts/authContext';

const ChatContext = createContext(null);

const DEFAULT_CHAT_TITLE = 'Nuevo chat';
const TITLE_MAX_LENGTH = 60;

function truncateTitle(text) {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed;
    return `${trimmed.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`;
}

function mapMessage(msg) {
    return {
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'USER' ? 'user' : 'bot',
        pending: false,
    };
}

export function ChatProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesLoadIdRef = useRef(0);

    const loadChats = useCallback(async () => {
        if (!user) {
            setChats([]);
            setIsLoadingChats(false);
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
        if (authLoading) return;
        loadChats();
    }, [authLoading, loadChats]);

    const loadMessages = useCallback(async (chatId) => {
        if (!chatId || String(chatId).startsWith('temp-')) {
            setMessages([]);
            return;
        }

        const loadId = ++messagesLoadIdRef.current;
        setIsLoadingMessages(true);

        try {
            const chat = await fetcher(`/chats/${chatId}`);
            if (loadId !== messagesLoadIdRef.current) return;
            setMessages((chat.messages ?? []).map(mapMessage));
        } catch (error) {
            if (loadId !== messagesLoadIdRef.current) return;
            console.error('Error cargando mensajes:', error);
            setMessages([]);
        } finally {
            if (loadId === messagesLoadIdRef.current) {
                setIsLoadingMessages(false);
            }
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
        const tempId = `temp-chat-${Date.now()}`;
        const optimisticChat = {
            id: tempId,
            title: DEFAULT_CHAT_TITLE,
            mode: 'CLIENT',
            updatedAt: new Date().toISOString(),
        };

        setChats((prev) => [optimisticChat, ...prev]);
        setActiveChat(optimisticChat);
        setMessages([]);

        try {
            const newChat = await fetcher('/chats', {
                method: 'POST',
                body: JSON.stringify({
                    title: DEFAULT_CHAT_TITLE,
                    mode: 'CLIENT',
                }),
            });
            setChats((prev) => prev.map((c) => (c.id === tempId ? newChat : c)));
            setActiveChat((prev) => (prev?.id === tempId ? newChat : prev));
            return newChat;
        } catch (error) {
            setChats((prev) => prev.filter((c) => c.id !== tempId));
            setActiveChat((prev) => (prev?.id === tempId ? null : prev));
            console.error('Error creando chat:', error);
            throw error;
        }
    }, []);

    const updateChatInList = useCallback((updatedChat) => {
        setChats((prev) =>
            prev.map((c) => (c.id === updatedChat.id ? { ...c, ...updatedChat } : c))
        );
        setActiveChat((prev) =>
            prev?.id === updatedChat.id ? { ...prev, ...updatedChat } : prev
        );
    }, []);

    const handleSendMessage = useCallback(
        async (text) => {
            if (!text.trim()) return;

            let chat = activeChat;
            const isFirstMessage = messages.length === 0;

            if (!chat) {
                chat = await handleCreateNewChat();
            }

            messagesLoadIdRef.current++;

            const optimisticUser = {
                id: `temp-user-${Date.now()}`,
                text,
                sender: 'user',
                pending: false,
            };
            const optimisticAssistant = {
                id: `temp-bot-${Date.now()}`,
                text: '',
                sender: 'bot',
                pending: true,
            };

            setMessages((prev) => [...prev, optimisticUser, optimisticAssistant]);
            setIsSending(true);

            if (isFirstMessage) {
                const title = truncateTitle(text);
                updateChatInList({ ...chat, title, updatedAt: new Date().toISOString() });
            }

            try {
                const data = await fetcher(`/messages/${chat.id}`, {
                    method: 'POST',
                    body: JSON.stringify({ prompt: text }),
                });

                setMessages((prev) => [
                    ...prev.filter(
                        (m) => m.id !== optimisticUser.id && m.id !== optimisticAssistant.id
                    ),
                    mapMessage(data.userMessage),
                    mapMessage(data.assistantMessage),
                ]);

                setChats((prev) => {
                    const title = data.chatTitle ?? (isFirstMessage ? truncateTitle(text) : undefined);
                    const updated = prev.map((c) => {
                        if (c.id !== chat.id) return c;
                        return {
                            ...c,
                            ...(title ? { title } : {}),
                            updatedAt: new Date().toISOString(),
                        };
                    });
                    return updated.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );
                });

                if (data.chatTitle || isFirstMessage) {
                    const title = data.chatTitle ?? truncateTitle(text);
                    setActiveChat((prev) =>
                        prev?.id === chat.id ? { ...prev, title } : prev
                    );
                }

                return data;
            } catch (error) {
                setMessages((prev) =>
                    prev.filter(
                        (m) => m.id !== optimisticUser.id && m.id !== optimisticAssistant.id
                    )
                );
                console.error('Error enviando mensaje:', error);
                throw error;
            } finally {
                setIsSending(false);
            }
        },
        [activeChat, handleCreateNewChat, messages.length, updateChatInList]
    );

    const removeChat = useCallback((chatId) => {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        setActiveChat((prev) => {
            if (prev?.id === chatId) {
                setMessages([]);
                return null;
            }
            return prev;
        });
    }, []);

    const insertChat = useCallback((chat) => {
        setChats((prev) => {
            if (prev.some((c) => c.id === chat.id)) return prev;
            return [chat, ...prev].sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
        });
    }, []);

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
            insertChat,
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
            insertChat,
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
