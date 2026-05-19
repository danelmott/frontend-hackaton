'use client';
import style from './verifyModal.module.css';
import { Icon } from '@/_components/icon/icon';
import useVerify from '@/_services/auth/useVerify';


export default function VerifyModal({open, onClose, email}) {
    const {
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
    } = useVerify({open, onClose, email});
    
    return (
        <dialog
            ref={dialogRef}
            className={style.dialog}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className={style.dialogWrapper}>
                <button
                    className={style.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    <Icon name='close' size='lg'/>
                </button>
                
                <header className={style.header}>
                    <div className={style.iconCircle}>
                        <Icon name='mail' size='lg'/>
                    </div>
                    <div>
                        <p className={style.eyeBrow}>Verificación</p>
                        <h2 className={style.title}>Revisa tu correo</h2>
                    </div>
                    
                    <p className={style.subtitle}>
                        Enviamos un código de 6 dígitos a<br />
                        <span className={style.emailText}>{email}</span>
                    </p>
                </header>
                
                <div className={style.body}>
                    <div className={style.digitsRow} onPaste={handleCodePaste}>
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                className={style.digit}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleDigitChange(e, index)}
                                onKeyDown={e => handleDigitKeyDown(e, index)}
                                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                aria-label={`Dígito ${index + 1} de 6`}
                            />
                        ))}
                    </div>
                    
                    <button
                        className={style.verifyButton}
                        onClick={handleSubmit}
                        disabled={!allDigitsFilled || loading}
                    >
                        {loading ? 'Verificando...' : 'Verificar'}
                    </button>

                    <p className={style.resendRow}>
                        ¿No llegó el correo?{' '}
                        <button
                            className={style.resendButton}
                            onClick={handleResendCode}
                            disabled={resendCoolDown > 0}
                        >
                            Reenviar
                        </button>
                        {resendCoolDown > 0 && (
                            <span className={style.resendCoolDown}> ({resendCoolDown}s)</span>
                        )}
                    </p>
                </div>
            </div>
        </dialog>
  );
}
