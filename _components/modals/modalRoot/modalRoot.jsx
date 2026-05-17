'use client';
import { useModal } from "@/_contexts/modalContext";
import UpdateChatModal from "../chatActions/updateChat/updateChat";
import DeleteChatModal from "../chatActions/deleteChat/deleteChat";
import LoginModal from "../auth/loginModal/loginModal";
import SignupModal from "../auth/signupModal/signupModal";

export default function ModalRoot() {
    const {modal, closeModal} = useModal();
    
    return (
        <>
            <UpdateChatModal
                open={modal.type === 'update_chat'}
                onClose={closeModal}
                currentName={modal?.data?.currentName}
                onConfirm={modal?.data?.onConfirm}
            />
            <DeleteChatModal
                open={modal.type === 'delete_chat'}
                onClose={closeModal}
                chatName={modal?.data?.chatName}
                onConfirm={modal?.data?.onConfirm}
            />
            <LoginModal 
                open={modal.type === 'login'}
                onCLose={closeModal}
                onSwitchToregister={() => console.log("switch to signup")}
            />
            
            <SignupModal
                open={modal.type === 'signup'}
                onCLose={closeModal}
                onswitchToLogin={() => console.log("switch to login")}
            />
        </>
    )
}