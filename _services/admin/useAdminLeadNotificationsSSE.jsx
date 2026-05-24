'use client';

import { useEffect, useRef } from 'react';
import { toastApi } from '@/_contexts/toastContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useAdminLeadNotificationsSSE({ enabled = true, onHotLead } = {}) {
  const onHotLeadRef = useRef(onHotLead);
  const seenRef = useRef(new Set());

  useEffect(() => {
    onHotLeadRef.current = onHotLead;
  }, [onHotLead]);

  useEffect(() => {
    if (!enabled || !API_URL) return;

    let source = null;
    let reconnectTimer = null;
    let unmounted = false;

    const connect = () => {
      if (unmounted) return;

      source = new EventSource(`${API_URL}/admin/notifications/stream`, {
        withCredentials: true,
      });

      source.addEventListener('connected', () => {
        seenRef.current.clear();
      });

      source.addEventListener('hot_lead', (event) => {
        try {
          const notification = JSON.parse(event.data);
          const key = `${notification.userId}:${notification.updatedAt}`;
          if (seenRef.current.has(key)) return;
          seenRef.current.add(key);

          const action = notification.nextAction ?? 'Revisar perfil';
          const product = notification.topProduct ? ` · ${notification.topProduct}` : '';
          const message = `Nuevo lead: ${notification.email}${product} — ${action}`;

          if (notification.priority === 'high') {
            toastApi.success(message, { duration: 8000 });
          } else {
            toastApi.info(message, { duration: 6000 });
          }

          onHotLeadRef.current?.(notification);
        } catch (err) {
          console.error('[SSE] hot_lead parse error', err);
        }
      });

      source.onerror = () => {
        source?.close();
        source = null;
        if (!unmounted) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      unmounted = true;
      clearTimeout(reconnectTimer);
      source?.close();
    };
  }, [enabled]);
}
