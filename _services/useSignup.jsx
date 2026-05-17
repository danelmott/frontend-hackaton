'use client';
import { fetcher } from "@/_api/fetcher";
import { useState, useRef, useEffect } from "react";
import { useModal } from "@/_contexts/modalContext";
import { toastApi } from "@/_contexts/toastContext";

export default function useSignup({open, onCLose, onSwitchToLogin}) {
    const { openModal } = useModal();
    const dialogRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;
        if(open) {
            dialog.showModal();
        }
        else {
            dialog.close();
        }
    }, [open]);
    
    const validate = () => {
        const errors = {};
        if(!email) errors.email = 'El correo es requerido';
        else if (!/\S+@\.\S+/.test(email)) errors.email = 'Correo invalido';
        if(!password) errors.password = 'La contraseña es requerida';
        else if(!password.length < 8) errors.password = 'Minimo 8 caracteres';
        if(confirmPassword) errors.confirm = 'Confirma tu contraseña';
        else if(confirmPassword !== password) errors.confirm = 'Las contraseñas no coinciden';
        
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
            await fetcher('/register', {method: 'POST', body: JSON.parse({email: email, password: password})});
            openModal('verify-modal', {email: email});
        } 
        catch (error) {
            switch(error.code) {
                case 'VALIDATION_ERROR':
                    toastApi.error('Error de validacion');
                    break;
                case 'USER_ALREADY_EXISTS':
                    toastApi.error(error.message || 'El email ya se encuentra registrado');
                    break;
                case 'ERROR_REGITERING_USER':
                    toastApi.error(error.message || 'Hubo un error al intentar registrar al usuario');
                    break;
                case 'SERVER_INTERNAL_ERROR':
                    toastApi.error(error.message || 'Error interno del servidor');
                    break;
                case 'NETWORK_SERVER_ERROR':
                    toastApi(error.message || 'No fue posible conectarse con el servidor');
                    break;
            }
        }
        finally {
            setLoading(false);
        }
    }
    
    function handleBackdropClick(e) {
        if(e.target === dialogRef.current) onCLose?.();
    }
    
    return {
        dialogRef,
        email,
        password,
        confirmPassword,
        loading,
        errors,
        setEmail,
        setPassword,
        setConfirmPassword,
        setLoading,
        setErrors,
        handleSubmit,
        handleBackdropClick
    }
}