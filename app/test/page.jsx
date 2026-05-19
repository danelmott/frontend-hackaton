'use client';

import { useState } from 'react';
// Asegúrate de que las rutas de importación coincidan con cómo exportas en tus componentes
import LoginModal from '@/_components/modals/auth/loginModal/loginModal';
import SignupModal from '@/_components/modals/auth/signupModal/signupModal';
import VerifyModal from '@/_components/modals/auth/verifyModal/verifyModal';

export default function TestAuthModalsPage() {
    // Maneja qué modal está abierto actualmente: 'login', 'signup', 'verify' o null
    const [activeModal, setActiveModal] = useState(null);
    
    const closeModal = () => setActiveModal(null);
    
    return (
        <div style={{ padding: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
            <h1>Prueba de Modales de Autenticación</h1>
            
            <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                    onClick={() => setActiveModal('login')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Abrir Login
                </button>
                
                <button 
                    onClick={() => setActiveModal('signup')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Abrir Registro (Signup)
                </button>
                
                <button 
                    onClick={() => setActiveModal('verify')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Abrir Verificación (Verify)
                </button>
            </div>
            
            {/* Renderizado condicional de las modales */}
            {activeModal === 'login' && (
                <LoginModal open={true} onClose={closeModal} />
            )}
            
            {activeModal === 'signup' && (
                <SignupModal open={true} onClose={closeModal} />
            )}
            
            {activeModal === 'verify' && (
                // Le paso "onCLose" también porque vi ese nombre en tu hook useVerify.jsx
                <VerifyModal open={true} onClose={closeModal} onCLose={closeModal} /> 
            )}
        </div>
    );
}