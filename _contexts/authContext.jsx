'use client';
import { createContext, useContext, useState, useEffect,useMemo } from "react";
import { toastApi } from "./toastContext";
import { fetcher } from "@/_api/fetcher";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const data = await fetcher('/auth/me', {method: 'GET'});
                setUser(data);
            } 
            catch (error) {
                toastApi.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, []);
    
    // Memoizamos el valor para evitar re-renders innecesarios en los hijos
    const value = useMemo(() => ({
        user, 
        loading
    }), [user, loading]);
    
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
