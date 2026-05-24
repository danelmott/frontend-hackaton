'use client';
import { createContext, useCallback, useContext, useState, useEffect, useMemo } from "react";
import { fetcher } from "@/_api/fetcher";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const refreshUser = useCallback(async () => {
        try {
            const data = await fetcher('/auth/me', { method: 'GET', skipRefresh: true });
            setUser(data.user ?? data);
            return data.user ?? data;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            await refreshUser();
            setLoading(false);
        };
        getUser();
    }, [refreshUser]);
    
    const value = useMemo(() => ({
        user, 
        loading,
        refreshUser,
        setUser,
    }), [user, loading, refreshUser]);
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un <AuthProvider>");
    }
    
    return context;
};
