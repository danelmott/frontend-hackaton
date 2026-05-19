'use client';
import { fetcher } from "@/_api/fetcher";
import { toastApi } from "@/_contexts/toastContext";
import { useEffect, useRef, useState } from "react";


export default function useLogin({open, onClose, onSwitchToRegister}) {
    const dialogRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;
        if(open) {
            dialog.showModal();
        }
        else {
            dialog.close()
        }
    }, [open]);
    
    const validate = () => {
        const errors = {};
        if(!email) errors.email = 'El Correo es requerido';
        else if(!/\S+@\S+\.\S+/.test(email)) errors.email = 'Correo invalido';
        if(!password) errors.password = 'La contraseña es requerida'
        return errors;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentErrors = validate();
        if(Object.keys(currentErrors).length) {
            setErrors(currentErrors);
            return;
        }
        setLoading(true);
        
        try {
            await fetcher('/login', {method: 'POST', body: JSON.stringify({email, password})})
            onClose?.()
        } 
        catch (error) {
            if(error.code === 'INVALID_CREDENTIALS') {
                toastApi.error('Hubo un error de validacion de datos');
            }
            
            toastApi.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    
    const handleBackdropClick = (e) => {
        const clickedOnBackdrop = e.target.tagName === 'DIALOG';
        if(clickedOnBackdrop) onClose?.();
    }
    
    const loginWithGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    }
    
    
    return {
        dialogRef,
        email,
        setEmail,
        password,
        setPassword,
        errors,
        loading,
        handleSubmit,
        handleBackdropClick,
        loginWithGoogle
    };
}