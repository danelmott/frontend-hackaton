'use client';
import { fetcher } from "@/_api/fetcher";
import { toastApi } from "@/_contexts/toastContext";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/_contexts/modalContext";

export default function useLogin({open, onClose, onSwitchToRegister}) {
    const dialogRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { openModal } = useModal();
    
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
    
    async function handleSubmit(e) {
        e.preventDefault();
        
        const currentErrors = validate();
        if(Object.keys(currentErrors).length) {
            setErrors(currentErrors);
            return;
        }
        
        setLoading(true);
        try {
            await fetcher('/login', 
                {method: 'POST', body: JSON.stringify({
                    email: email,
                    password: password
                })});
                openModal('');
        } 
        catch (error) {
            toastApi.error(error.message)
            
            switch(error.code) {
                case 'INVALID_CREDENTIALS':
                    toastApi.error(error.message || 'Credenciales invalidas!, vuelve a intentarlo');
                    break;
                case 'EMAIL_NOT_VERIFIED':
                    toastApi.error(error.message || 'Correo no verificado');
                    openModal('verify_email', {email: email});
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi.error(error.message || 'No fue posible conectarse con el servidor');
                    break;
            }
        }
        finally {
            setLoading(false);
        }
    }
    
    function handleBackdropClick(e) {
        if(e.target === dialogRef.current) onClose?.()
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
        handleBackdropClick
    };
}