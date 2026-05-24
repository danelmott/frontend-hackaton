'use client';

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

const NO_REFRESH_ENDPOINTS = [
    '/auth/me',
    '/auth/login',
    '/auth/register',
    '/auth/verification-user',
    '/auth/resend-verification',
];

function shouldAttemptRefresh(endpoint, skipRefresh) {
    if (skipRefresh) return false;
    return !NO_REFRESH_ENDPOINTS.some((path) => endpoint.startsWith(path));
}

async function parseResponse(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export async function fetcher(endpoint, options = {}) {
    const { skipRefresh = false, ...fetchOptions } = options;

    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
        ...fetchOptions,
    };

    try {
        let response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

        if ((response.status === 401 || response.status === 403) && !shouldAttemptRefresh(endpoint, skipRefresh)) {
            const data = await parseResponse(response);
            throw {
                code: data?.code || 'UNAUTHORIZED',
                message: data?.message || 'No autorizado',
                email: data?.email,
            };
        }

        if (response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (!refreshResponse.ok) {
                        throw new Error('El refresh token expiró o es inválido');
                    }

                    processQueue(null);
                    response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
                } catch (refreshError) {
                    processQueue(refreshError);
                    throw {
                        code: 'SESSION_EXPIRED',
                        message: 'Tu sesión ha expirado',
                    };
                } finally {
                    isRefreshing = false;
                }
            } else {
                await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
                response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
            }
        }

        const data = await parseResponse(response);

        if (!response.ok) {
            throw {
                code: data?.code || 'SERVER_ERROR',
                message: data?.message || 'Error en la peticion',
            };
        }

        return data;
    } catch (error) {
        if (error.code) throw error;

        throw {
            code: 'NETWORK_SERVER_ERROR',
            message: 'Hubo un error al intentar conectarse con el servidor',
        };
    }
}