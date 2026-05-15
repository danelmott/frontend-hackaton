'use client';
import { toastApi } from "@/_contexts/toastContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if(error) {
            prom.reject(error);
        }
        else {
            prom.resolve();
        }
    });
    failedQueue = [];
}

export async function fetcher(endpoint, options = {}) {
    
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    try {
        let response = await fetch(`${API_URL}${endpoint}`, defaultOptions)
        
        if(response.status === 401) {
            if(!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include'
                    });
                    
                    if(!refreshResponse.ok) {
                        toastApi.error("Tu sesión ha expirado");
                        throw new Error("El re-fresh token expiró o inválido");
                    }
                    
                    processQueue(null);
                    response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
                }
                catch(refreshError) {
                    processQueue(refreshError);
                    
                    if(typeof window !== 'undefined') {
                        window.location.href = '/login'
                    }
                    throw {code: 'SESSION_EXPIRED', message: 'Tu sesíon de expirado'};
                }
                finally {
                    isRefreshing = false;
                }
            }
            else {
                await new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                });
                response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
            }
        }
        
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        
        if(!response.ok) throw {code: data?.code || 'SERVER_ERROR', message: data?.message || 'Error en la peticion'};
        return data;
    } 
    catch (error) {
        if(error.code) throw error;
        
        throw {
            code: 'NETWORK_SERVER_ERROR',
            message: 'Hubo un error al intentar conectarse con el servidor'
        }
    }
}