'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/_api/fetcher';

export default function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const result = await fetcher('/admin/dashboard', { method: 'GET' });
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err.message || 'Error al cargar dashboard');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}
