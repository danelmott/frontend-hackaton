'use client';
import { useState, useRef, useEffect, useCallback } from "react";
import { toastApi, useToast } from "@/_contexts/toastContext";
import { fetcher } from "@/_api/fetcher";
import { useDebounce } from "@/_hooks/useDebounce";

export default function useSidebar() {
    const { toast } = useToast();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const searchRef = useRef(null);
    const menuRef = useRef(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    
    async function handleCreateNewChat() {
        try {
            await fetcher('/chats', {method: 'POST'});
        } 
        catch (error) {            
            if(error.code === 'ERROR_CREATING_CHAT') {
                return toastApi.error(error.message ?? 'Hubo un error al intentar crear el chat');
            }
            
            if(error.code === 'NETWORK_SERVER_ERROR') {
                return toastApi.error(error.message ?? 'Hubo un error al intentar conectarse con el servidor')
            }
            
            if(error.code === 'SERVER_INTERNAL_ERROR') {
                return toastApi.error(error.message ?? 'Error interno del servidor');
            }
        }
    }
    
    const handleSearchChat = useCallback(async (query) => {
        try {
            const endpoint = query ? `/chats?q=${query}` : '/chats';
            const searchedChats = await fetcher(endpoint, { method: 'GET' });
            setChats(searchedChats);
        } 
        catch (error) {
            toast(error.message ?? "Hubo un error al intentar buscar el chat", {type: 'error'})
        }
    }, [toast]);
    
    
    //EFECTO PARA CAMBIAR EL RENDERIZADO DE LOS CHATS EN EL SIDEBAR
    useEffect(() => {
        handleSearchChat(debouncedSearchQuery);
    }, [debouncedSearchQuery, handleSearchChat]);
    
    useEffect(() => {
        async function getChats() {
            try {
                const data = await fetcher('/chats', {method: 'GET'});
                setChats(data.chats);
            } 
            catch (error) {
                switch(error.code) {
                    case 'ERROR_GETTING_CHATS':
                        toastApi.error(error.message ||'Hubo un error al intentar obtener los chats');
                        break;
                    case 'SERVER_INTERNAL_ERROR':
                        toastApi.error(error.message ||'Error interno del servidor');
                        break;
                    case 'NETWORK_SERVER_ERROR':
                        toastApi.error(error.message || 'No fue posible conectarse con el servidor');
                        break;
                }
            }
        }
        
        getChats();
    }, []); 
    
    return {
        chats,
        activeChat,
        setActiveChat,
        setSearchQuery,
        searchRef,
        menuRef,
        handleCreateNewChat
    }
}