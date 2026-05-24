'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/_contexts/authContext';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.replace('/chat');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className={styles.loading}>
        <p>Cargando panel admin...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Serfinanza</p>
          <h1 className={styles.title}>Panel Admin</h1>
        </div>
        <p className={styles.user}>{user.email}</p>
      </header>
      {children}
    </div>
  );
}
