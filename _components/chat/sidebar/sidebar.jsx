"use client";
import { useState } from 'react';
import styles from './sidebar.module.css'
import ChatItem from './chatItem/chatItem';
import useSidebar from '@/_services/chat/useSidebar';
import { Icon } from '@/_components/icon/icon';
import Image from 'next/image';
import UserSection from './UserSection/userSection';
import Subject from './subject/subject';

export default function Sidebar() {
  const { chats, activeChat, handleCreateNewChat } = useSidebar();
  const [isOpen, setIsOpen] = useState(true);
  
  // Datos de prueba (Mocks) para visualizar los chats normales y fijados en caso de que no haya chats aún
  const demoChats = [
    { id: 'c1', title: 'Apuntes de Álgebra y Geometría', pinned: true },
    { id: 'c2', title: 'Explicación de recursividad', pinned: true },
    { id: 'c3', title: 'Ideas para proyecto de Next.js', pinned: false },
    { id: 'c4', title: 'Resumen del capítulo 4', pinned: false },
    { id: 'c5', title: 'Preparación para parcial de Física', pinned: false },
  ];
  
  // Usamos los chats reales o los de prueba si está vacío
  const displayChats = chats && chats.length > 0 ? chats : demoChats;
  
  // Filtramos fijados y recientes
  const pinnedChats = displayChats.filter((c) => c.pinned);
  const recentChats = displayChats.filter((c) => !c.pinned);
  
  // Mock de Asignaturas/Espacios
  const demoSubjects = [
    { id: 's1', title: 'Álgebra Lineal' },
    { id: 's2', title: 'Desarrollo Web' },
  ];
  
  const user = {
    name: 'gabriel cervantes',
    email: 'danel@gmail.com',
    src: ''
  }

  return (
    <>
      {!isOpen && (
        <button
          className={styles.openToggle}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir panel lateral"
        >
          <Icon name="left_panel_open" size="md" />
        </button>
      )}
      
      <aside className={`${styles.sidebar} ${isOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <Image 
                src="/logo-aguilaria-1.png" 
                alt="aguilarIA" 
                width={28} 
                height={28} 
                className={styles.logoDark}
              />
              <span className={styles.logoText}>aguilarIA</span>
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
            <button className={styles.actionButton}>
              <Icon name='add' size='md'/>
              Crear Chat
            </button>
            <button className={styles.actionButton} style={{ marginBottom: "10px" }}>
              <Icon name='search' size='md'/>
              Buscar Chat
            </button>
          </div>
          
          <nav className={styles.chatList}>
            {pinnedChats.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Fijados</span>
                {pinnedChats.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            )}
            
            {/* Sección de Asignaturas (Mock) */}
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
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            )}
          </nav>
          
          {/* Botón de Feedback */}
          <div className={styles.feedbackContainer}>
            <a href="/feedback" className={styles.feedbackButton}>
              <Icon name="lightbulb" size="sm" />
              <span>Enviar Feedback</span>
            </a>
          </div>
          
          <UserSection user={user}/>
        </div>
      </aside>
    </>
  );
}
