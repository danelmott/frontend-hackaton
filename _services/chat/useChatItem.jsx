'use client';
import { useState } from "react";
import { useModal } from "@/_contexts/modalContext";
import { useChat } from "@/_contexts/chatContext";
import { fetcher } from "@/_api/fetcher";
import { toastApi } from "@/_contexts/toastContext";

export default function useChatItem(chat) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    const { removeChat, updateChatInList } = useChat();
    
    const handleAction = async (actionId) => {
        switch(actionId) {
            case 'update_chat':
                setMenuOpen(false);
                openModal("update_chat", {
                    currentName: chat.title,
                    onConfirm: async (newName) => await handleUpdateChat(newName, chat.id)
                });
                break;
                
            case 'delete_chat':
                setMenuOpen(false);
                openModal("delete_chat", {
                    chatName: chat.title,
                    onConfirm: async () => await handleDeleteChat(chat.id)
                });
                break;
                
            case 'highlight_chat':
                setMenuOpen(false);
                await handleHighlitedChat(chat.id);
                break;
                
            case 'archive_chat':
                setMenuOpen(false);
                await handleArchivedChat(chat.id);
                break;
        }
    }
    
    async function handleUpdateChat(newName, chatId) {
        try {
            const data = await fetcher(`/chats/${chatId}`, {
                method: 'PUT',
                body: JSON.stringify({title: newName})
            });
            
            updateChatInList(data);
            return data;
        } 
        catch (error) {
            switch(error.code) {
                case 'CHAT_NOT_FOUND':
                    toastApi.error(error.message || 'No fue posible encontrar el chat que intentas actualizar');
                    break;
                case 'ERROR_UPDATING_CHAT':
                    toastApi.error(error.message || 'No fue posible actualizar el chat');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi.error(error.message || 'No fue posible conectarse con el servidor');
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
            }
        }
    }
    
    async function handleDeleteChat(chatId) {
        try {
            const data = await fetcher(`/chats/${chatId}`, {
                method: 'DELETE'
            });
            
            removeChat(chatId);
            return data;
        } 
        catch (error) {
            switch(error.code) {
                case 'CHAT_NOT_FOUND':
                    toastApi.error(error.message ||'No fue posible encontrar el chat que intentas eliminar');
                    break;
                case 'ERROR_DELETING_CHAT':
                    toastApi.error(error.message || 'No fue posible eliminar el chat');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi.error(error.message || 'No fue posible conectarse con el servidor');
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
            }
        }
    } 
    
    async function handleArchivedChat(chatId, isArchived) {
        try {
            const data = await fetcher(`/chats/${chatId}/archive`, {
                method: 'PUT',
                body: JSON.stringify({isArchived})
            });
            
            return data;
        } 
        catch (error) {
            switch(error.code) {
                case 'CHAT_NOT_FOUND':
                    toastApi.error(error.message || 'No fue posible encontrar el chat que intentas archivar');
                    break;
                case 'ERROR_ARCHIVING_CHAT':
                    toastApi.error(error.message || 'No fue posible archivar el chat');
                    break;
                case 'VALIDATION_ERROR':
                    toastApi.error('los datos enviados no fueron los esperados por el servidor');
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi.error(error.message || 'No fue posible conectar con el servidor');
                    break;
                }
        }
    }
    
    async function handleHighlitedChat(chatId, isStarred) {
        try {
            const data = await fetcher(`/chats/${chatId}/star`, {
                method: 'PUT',
                body: JSON.stringify({isStarred})
            });
            
            return data;
        } 
        catch (error) {
            switch(error.code) {
                case ('CHAT_NOT_FOUND'):
                    toastApi.error(error.message || 'No fue posible encontrar el chat que intentas destacar');
                    break;
                case 'ERROR_STARRING_CHAT':
                    toastApi.error(error.message || 'No fue posible destacar el chat');
                    break;
                case 'VALIDATION_ERROR':
                    toastApi.error('los datos enviados no fueron los esperados por el servidor');
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi.error(error.message || 'No fue posible conectar con el servidor');
                    break
            }
        }
    }
    
    return {
        menuOpen,
        setMenuOpen,
        handleAction
    }
}