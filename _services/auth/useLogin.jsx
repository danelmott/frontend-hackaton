'use client';
import { fetcher } from "@/_api/fetcher";
import { toastApi } from "@/_contexts/toastContext";
import { useAuth } from "@/_contexts/authContext";
import { useModal } from "@/_contexts/modalContext";
import { useEffect, useRef, useState } from "react";


export default function useLogin({open, onClose, onSwitchToRegister}) {
    const { refreshUser } = useAuth();
    const { openVerifyModal } = useModal();
    const dialogRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
            return;
        }

        if (dialog.open) dialog.close();
    }, [open]);

    const redirectToVerify = (targetEmail) => {
        onClose?.();
        openVerifyModal(targetEmail);
    };
    
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
            await fetcher('/auth/login', {method: 'POST', body: JSON.stringify({email, password})})
            await refreshUser();
            onClose?.()
        } 
        catch (error) {
            if (error.code === 'EMAIL_NOT_VERIFIED') {
                toastApi.error(error.message || 'Debes verificar tu correo antes de iniciar sesión');
                redirectToVerify(error.email || email);
                return;
            }

            if (error.code === 'INVALID_CREDENTIALS') {
                toastApi.error('Credenciales inválidas');
                return;
            }

            toastApi.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    const handleOpenVerify = () => {
        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Ingresa tu correo para verificar' }));
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors((prev) => ({ ...prev, email: 'Correo inválido' }));
            return;
        }
        redirectToVerify(email);
    };
    
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
        handleOpenVerify,
        loginWithGoogle
    };
}
