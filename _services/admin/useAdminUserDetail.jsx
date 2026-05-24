'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/_api/fetcher';

export default function useAdminUserDetail(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const result = await fetcher(`/admin/users/${userId}`, { method: 'GET' });
        if (active) setUser(result.user);
      } catch (err) {
        if (active) setError(err.message || 'Error al cargar usuario');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [userId]);

  return { user, loading, error };
}
