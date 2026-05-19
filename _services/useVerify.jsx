'use client';
import { fetcher } from "@/_api/fetcher";
import { toastApi } from "@/_contexts/toastContext";
import { useEffect, useRef, useState} from "react";

export default function useVerify({email, open, onClose }) {
    const TOTAL_DIGITS = 6;
    const RESEND_COOLDOWN_SECS = 60;
    const inputsRef = useRef([]);
    const dialogRef = useRef(null);
    const [digits, setDigits] = useState(Array(TOTAL_DIGITS).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendCoolDown, setResendCoolDown] = useState(0);
    const allDigitsFilled = digits.every(Boolean);
    
    //CUENTA REGRESIVA PARA REENVIO
    useEffect(() => {
        if(resendCoolDown <= 0) return;
        const tick = setTimeout(() => setResendCoolDown(prev => prev - 1), 1000);
        return () => clearTimeout(tick);
    }, [resendCoolDown]);
    
    
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;
        if(open) {
            dialog.showModal();
            setTimeout(() => inputsRef.current[0]?.focus(), 50);
        }
        else {
            if(dialog.open) dialog?.close();
        }
    }, [open])
    
    
    const focusDigitAt = (idx) => {
        inputsRef.current[idx]?.focus();
    }
    
    const replaceDigitAt = (idx, newValue) => {
        setDigits(prev => {
            const updated = [...prev];
            updated[idx] = newValue;
            return updated;
        });
    }
    
    const clearAllDigits = () => {
        setDigits(Array(TOTAL_DIGITS).fill(''));
    }
    
    const handleDigitChange = (e, idx) => {
        const numberOnly = e.target.value.replace(/\D/g, '');
        if(!numberOnly) return;
        replaceDigitAt(idx, numberOnly[0]);
        
        const hasNextDigit = idx < TOTAL_DIGITS - 1;
        
        if(hasNextDigit) focusDigitAt(idx + 1);
    }
    
    const handleDigitKeyDown = (e, idx) => {
        const isFirstDigit = idx === 0;
        const isLastDigit = idx === TOTAL_DIGITS;
        
        if(e.key === 'Backspace') {
            if(digits[idx]) {
                replaceDigitAt(idx, '');
            }
            else if(!isFirstDigit) {
                replaceDigitAt(idx - 1, '');
                focusDigitAt(idx - 1);
            }
        }
        
        if(e.key === 'ArrowLeft' && !isFirstDigit) {
            focusDigitAt(idx - 1);
        }
        
        if(e.key === 'ArrowRight' && !isLastDigit) {
            focusDigitAt(idx + 1);
        }
    }
    
    const handleCodePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedDigits = pastedText.replace(/\D/g, '').slice(0, TOTAL_DIGITS);
        const filledPositions = Array(TOTAL_DIGITS).fill('');
        
        pastedDigits.split('').forEach((char, index) => {
            filledPositions[index] = char;            
        });
        
        setDigits(filledPositions);
        const lastFilledIndex = Math.min(pastedDigits.length, TOTAL_DIGITS - 1);
        focusDigitAt(lastFilledIndex);
    }
    
    //CERRAR MODAL SI SE HACE CLICK EN LA EL BACKDROP
    const handleBackdropClick = (e) => {
        const clickedOnBackdrop = e.target.tagName === 'DIALOG';
        if(clickedOnBackdrop) onClose?.();
    }
    
    const handleSubmit = async () => {
        const code = digits.join('');
        setLoading(true);
        try {
            await fetcher('/verify-account', {
                method: 'POST',
                body: JSON.stringify({email, code})
            });
            
            onClose?.();
            window.location.href = 'chats';
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
    
    const handleResendCode = async () => {
        setResendCoolDown(RESEND_COOLDOWN_SECS);
        clearAllDigits();
        setTimeout(() => {focusDigitAt(0), 50});
        
        try {
            await fetcher('/resend-verification', {
                method: 'POST',
                body: JSON.stringify({email})
            });
        } 
        catch (error) {
            if(error.code === 'VALIDATION_ERROR') {
                toastApi.error('Hubo un error de validacion de datos');
            }
            
            toastApi.error(error.message);
        }
    }
    
    return {
        inputsRef,
        dialogRef,
        digits,
        loading,
        resendCoolDown,
        allDigitsFilled,
        handleDigitChange,
        handleDigitKeyDown,
        handleCodePaste,
        handleBackdropClick,
        handleResendCode,
        handleSubmit
    }
}