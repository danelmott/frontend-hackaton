"use client";
import styles from './sidebar.module.css'
import ChatItem from './chatItem/chatItem';

const INITIAL_CHATS = [
  { id: 1, title: "Diseño del nuevo dashboard", time: "Ahora", pinned: true },
  { id: 2, title: "Refactor de autenticación", time: "2h", pinned: true },
  { id: 3, title: "Revisión de PRs pendientes", time: "Ayer" },
  { id: 4, title: "API de pagos con Stripe", time: "Ayer" },
  { id: 5, title: "Optimización de queries SQL", time: "Lun" },
  { id: 6, title: "Migración a TypeScript", time: "Lun" },
  { id: 7, title: "Documentación de endpoints", time: "Dom" },
  { id: 8, title: "Setup de CI/CD con GitHub Actions", time: "Vie" },
  { id: 9, title: "Análisis de métricas Q3", time: "Jue" },
];

export default function Sidebar() {
  const activeChat = 1;
  const pinnedChats = INITIAL_CHATS.filter((c) => c.pinned);
  const recentChats = INITIAL_CHATS.filter((c) => !c.pinned);
  
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>Chats</span>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} aria-label="Buscar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className={styles.iconBtn} aria-label="Nuevo chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
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

        {recentChats.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Recientes</span>
            {recentChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>JD</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Juan Díaz</span>
          <span className={styles.userStatus}>En línea</span>
        </div>
      </div>
    </aside>
  );
}
