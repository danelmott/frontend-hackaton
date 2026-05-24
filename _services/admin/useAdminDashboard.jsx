'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetcher } from '@/_api/fetcher';

export default function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadIdRef = useRef(0);

  const refresh = useCallback(async (silent = false) => {
    const loadId = ++loadIdRef.current;
    if (!silent) setLoading(true);

    try {
      const result = await fetcher('/admin/dashboard', { method: 'GET' });
      if (loadId === loadIdRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (loadId === loadIdRef.current) {
        setError(err.message || 'Error al cargar dashboard');
      }
    } finally {
      if (loadId === loadIdRef.current && !silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
