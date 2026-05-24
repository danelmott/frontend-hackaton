'use client';

import { useChat } from '@/_contexts/chatContext';

/** @deprecated Usa useChat() directamente */
export default function useSidebar() {
    return useChat();
}
