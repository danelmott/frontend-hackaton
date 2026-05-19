'use client';
import useSignup from '@/_services/auth/useSignup';
import style from './signupModal.module.css';
import { Icon } from '@/_components/icon/icon';
import { GoogleIcon } from '../loginModal/loginModal';

export default function SignupModal({open, onClose, onswitchToLogin}) {
    const {
        dialogRef,
        email,
        password,
        confirmPassword,
        loading,
        errors,
        setConfirmPassword,
        setEmail,
        setErrors,
        setLoading,
        setPassword,
        handleBackdropClick,
        handleSubmit,
        loginWithGoogle
    } = useSignup({open, onClose, onswitchToLogin});
    
    return (
        <dialog
            ref={dialogRef}
            className={style.dialog}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className={style.dialogWrapper}>
                <button className={style.closeButton} onClick={onClose} aria-label='Cerrar modal'>
                    <Icon name='close' size='lg'/>
                </button>
                <div className={style.header}>
                    <p className={style.eyebrow}>Crea tu cuenta</p>
                    <h2 className={style.title}>Registrate</h2>
                    <p className={style.subtitle}>Únete gratis a aguilarIA</p>
                </div>
                
                <form className={style.body} onSubmit={handleSubmit}>
                    <div className={style.field}>
                        <label htmlFor="signup-email" className={style.label}>Correo</label>
                        <input
                            id='signup-email'
                            type="text"
                            className={style.input}
                            placeholder='tu@correo.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={style.field}>
                        <label htmlFor="signup-password" className={style.label}>Contraseña</label>
                        <input 
                            id='signup-password'
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={style.input}
                        />
                    </div>
                    <div className={style.field}>
                        <label htmlFor="signup-verify-password" className={style.label}>Confirma tu contraseña</label>
                        <input 
                            id='signup-verify-password'
                            type="text"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={style.input}
                        />
                    </div>
                    
                    <button className={style.submitBtn} type='submit' disabled={loading}>
                        {loading ? 'Creando cuenta...': 'Registrarse'}
                    </button>
                    
                    <div className={style.divider}>
                        <span className={style.dividerLine}/>
                        <span className={style.dividerText}>o</span>
                        <span className={style.dividerLine}/>
                    </div>
                    
                    <button className={style.oauthBtn} onClick={loginWithGoogle} type='button'>
                        <GoogleIcon/>
                        Registrarse con Google
                    </button>
                </form>
                <div className={style.footer}>
                    <span className={style.footerText}>¿Ya tienes cuenta?</span>
                    <button className={style.footerLink} onClick={onswitchToLogin}>Inicia Session</button>
                </div>
            </div>
        </dialog>
    )
}