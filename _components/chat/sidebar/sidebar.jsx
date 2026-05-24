"use client";
import styles from './sidebar.module.css'
import ChatItem from './chatItem/chatItem';
import { useChat } from '@/_contexts/chatContext';
import { useAuth } from '@/_contexts/authContext';
import { Icon } from '@/_components/icon/icon';
import Image from 'next/image';
import UserSection from './UserSection/userSection';

export default function Sidebar({ isOpen, setIsOpen }) {
  const {
    chats,
    activeChat,
    isLoadingChats,
    handleSelectChat,
    handleCreateNewChat,
  } = useChat();
  const { user } = useAuth();

  const displayUser = user
    ? {
        name: user.email?.split('@')[0] ?? 'Usuario',
        email: user.email,
        src: '',
      }
    : {
        name: 'Invitado',
        email: 'Inicia sesión',
        src: '',
      };

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <Image 
                src="/logo_principal1.png" 
                alt="Serfi IA" 
                width={28} 
                height={28} 
                className={styles.logoDark}
              />
              <span className={styles.logoText}>Serfi IA</span>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.iconBtn} 
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar panel lateral"
              >
                <Icon name="left_panel_close" size="sm" />
              </button>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={handleCreateNewChat}
              disabled={!user}
            >
              <Icon name='add' size='md'/>
              Crear Chat
            </button>
          </div>
          
          <nav className={styles.chatList}>
            {isLoadingChats && (
              <p className={styles.sectionLabel}>Cargando chats...</p>
            )}

            {!isLoadingChats && chats.length === 0 && user && (
              <p className={styles.sectionLabel}>No tienes chats aún</p>
            )}
            
            {chats.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Recientes</span>
                {chats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    active={activeChat?.id === chat.id}
                    onSelect={() => handleSelectChat(chat)}
                  />
                ))}
              </div>
            )}
          </nav>
          
          <UserSection user={displayUser}/>
        </div>
      </aside>
    </>
  );
}
