'use client';
import style from './chatLayout.module.css';
import ChatInput from '../chatInput/chatInput';
import MessageContainer from '../messageContainer/messageContainer';
import { useState } from 'react';


export default function chatLayout() {
    const [messages, setMessages] = useState([]);
    const handleSendMessage = (text) => {
        setMessages
    }
} 