'use client';
import useLogin from '@/_services/auth/useLogin';
import style from './loginModal.module.css';
import { Icon } from '@/_components/icon/icon';

//ESTE ICONO TAMBIEN SE USA EN LA MODAL SIGNUP
export const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
)

export default function LoginModal({open, onClose, onSwitchToregister}) {
    const{
        dialogRef,
        email,
        password,
        loading,
        errors,
        setEmail,
        setPassword,
        handleBackdropClick,
        handleSubmit,
        loginWithGoogle
    } = useLogin({open, onClose, onSwitchToregister});
    
    
    return (
        <dialog 
            className={style.dialog}
            ref={dialogRef}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className={style.dialogWrapper}>
                <button className={style.closeButton} onClick={onClose}>
                    <Icon name='close' size='lg'/>
                </button>
                
                <div className={style.header}>
                    <p className={style.eyeBrow}>Bienvenido de vuelta</p>
                    <h2 className={style.title}>Iniciar sesión</h2>
                    <p className={style.subtitle}>Accede a tu cuenta para continuar</p>
                </div>
                
                <form className={style.body} onSubmit={handleSubmit} noValidate>
                    <div className={style.field}>
                        <label 
                            className={style.label}
                            htmlFor='login-email'
                        >
                            Correo
                        </label>
                        <input 
                            id='login-email'
                            type="text" 
                            className={`${style.input} ${errors.email ? style.inputError : ''}`}
                            placeholder='tu@correo.com'
                            autoComplete='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className={style.field}>
                        <label 
                            className={style.label}
                            htmlFor="login-password"
                        >
                            Contraseña
                        </label>
                        <input 
                            id='login-password'
                            type="text"
                            className={`${style.input} ${errors.password ? style.inputError : ''}`}
                            placeholder='••••••••'
                            autoComplete='current-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className={style.submitButton}  
                        type='submit' 
                        disabled={loading}
                    >
                        {loading ? 'Verificando': 'Iniciar sesión'}
                    </button>
                    
                    <div className={style.divider}>
                        <span className={style.dividerLine}/>
                        <span className={style.dividerText}>o</span>
                        <span className={style.dividerLine}/>
                    </div>
                    <button type='button' onClick={loginWithGoogle} className={style.oauthButton}>
                        <GoogleIcon/>
                        Continuar con Google
                    </button>
                </form>
                
                <div className={style.footer}>
                    <span className={style.footerText}>¿No tienes cuenta?</span>
                    <button className={style.footerLink} onClick={onSwitchToregister}>Regístrate</button>
                </div>
            </div>
        </dialog>
    )
}