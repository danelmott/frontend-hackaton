"use client";
import styles from './sidebar.module.css'
import ChatItem from './chatItem/chatItem';
import { useChat } from '@/_contexts/chatContext';
import { useAuth } from '@/_contexts/authContext';
import { Icon } from '@/_components/icon/icon';
import Image from 'next/image';
import UserSection from './UserSection/userSection';
import Subject from './subject/subject';

export default function Sidebar({ isOpen, setIsOpen }) {
  const {
    chats,
    activeChat,
    isLoadingChats,
    handleSelectChat,
    handleCreateNewChat,
  } = useChat();
  const { user } = useAuth();

  const demoSubjects = [
    { id: 's1', title: 'Álgebra Lineal' },
    { id: 's2', title: 'Desarrollo Web' },
  ];

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

  const recentChats = chats;

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
            <button className={styles.actionButton} style={{ marginBottom: "10px" }}>
              <Icon name='search' size='md'/>
              Buscar Chat
            </button>
          </div>
          
          <nav className={styles.chatList}>
            {isLoadingChats && (
              <p className={styles.sectionLabel}>Cargando chats...</p>
            )}

            {!isLoadingChats && recentChats.length === 0 && user && (
              <p className={styles.sectionLabel}>No tienes chats aún</p>
            )}

            {demoSubjects.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Asignaturas</span>
                {demoSubjects.map((subject) => (
                  <Subject key={subject.id} subject={subject}/>
                ))}
              </div>
            )}
            
            {recentChats.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Recientes</span>
                {recentChats.map((chat) => (
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
          
          <div className={styles.feedbackContainer}>
            <a href="/feedback" className={styles.feedbackButton}>
              <Icon name="lightbulb" size="sm" />
              <span>Enviar Feedback</span>
            </a>
          </div>
          
          <UserSection user={displayUser}/>
        </div>
      </aside>
    </>
  );
}
