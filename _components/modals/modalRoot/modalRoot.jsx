'use client';
import { useModal } from "@/_contexts/modalContext";
import UpdateChatModal from "../chatActions/updateChat/updateChat";
import DeleteChatModal from "../chatActions/deleteChat/deleteChat";
import LoginModal from "../auth/loginModal/loginModal";
import SignupModal from "../auth/signupModal/signupModal";
import VerifyModal from "../auth/verifyModal/verifyModal";

export default function ModalRoot() {
    const {modal, closeModal, openModal} = useModal();
    const UPDATE_CHAT_MODAL = 'update_chat';
    const DELETE_CHAT_MODAL = 'delete_chat';
    const LOGIN_MODAL = 'login';
    const SIGNUP_MODAL = 'signup';
    const VERIFY_MODAL = 'verify-modal';
    
    return (
        <>
            <UpdateChatModal
                open={modal.type === UPDATE_CHAT_MODAL}
                onClose={closeModal}
                currentName={modal?.data?.currentName}
                onConfirm={modal?.data?.onConfirm}
            />
            <DeleteChatModal
                open={modal.type === DELETE_CHAT_MODAL}
                onClose={closeModal}
                chatName={modal?.data?.chatName}
                onConfirm={modal?.data?.onConfirm}
            />
            <LoginModal 
                open={modal.type === LOGIN_MODAL}
                onClose={closeModal}
                onSwitchToregister={() => openModal(SIGNUP_MODAL)}
            />
            
            <SignupModal
                open={modal.type === SIGNUP_MODAL}
                onClose={closeModal}
                onswitchToLogin={() => openModal(LOGIN_MODAL)}
            />

            <VerifyModal
                open={modal.type === VERIFY_MODAL}
                onClose={closeModal}
                email={modal?.data?.email}
            />
        </>
    )
}