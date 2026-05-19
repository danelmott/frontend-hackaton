'use client';
import { fetcher } from "@/_api/fetcher";
import { useState, useRef, useEffect } from "react";
import { toastApi } from "@/_contexts/toastContext";

export default function useSignup({open, onClose}) {
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
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentErrors = validate();
        if(Object.keys(currentErrors).length) {
            setErrors(currentErrors);
            return;
        }
        setLoading(true);
        try {
            await fetcher('/register', {method: 'POST', body: JSON.stringify({email, password})})
            openModal('verify-modal', {email});
        } 
        catch (error) {
            if(error.code === 'VALIDATION_ERROR') {
                toastApi.error('Hubo un error de validacion de datos');
            }
            
            toastApi.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    
    //CERRRAR MODAL SI SE HACE CLICK EN EL BACKDROP
    const handleBackdropClick = (e) => {
        const clickedOnBackdrop = e.target.tagName === 'DIALOG';
        if(clickedOnBackdrop) onClose?.()
    }
    
    const loginWithGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
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
        handleBackdropClick,
        loginWithGoogle
    }
}