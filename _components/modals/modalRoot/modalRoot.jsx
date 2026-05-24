'use client';
import { useModal } from "@/_contexts/modalContext";
import { MODAL_TYPES } from "@/_constants/modalTypes";
import UpdateChatModal from "../chatActions/updateChat/updateChat";
import DeleteChatModal from "../chatActions/deleteChat/deleteChat";
import LoginModal from "../auth/loginModal/loginModal";
import SignupModal from "../auth/signupModal/signupModal";
import VerifyModal from "../auth/verifyModal/verifyModal";

export default function ModalRoot() {
    const { modal, closeModal, openLoginModal, openSignupModal } = useModal();
    
    return (
        <>
            <UpdateChatModal
                open={modal.type === MODAL_TYPES.UPDATE_CHAT}
                onClose={closeModal}
                currentName={modal?.data?.currentName}
                onConfirm={modal?.data?.onConfirm}
            />
            <DeleteChatModal
                open={modal.type === MODAL_TYPES.DELETE_CHAT}
                onClose={closeModal}
                chatName={modal?.data?.chatName}
                onConfirm={modal?.data?.onConfirm}
            />
            <LoginModal 
                open={modal.type === MODAL_TYPES.LOGIN}
                onClose={closeModal}
                onSwitchToregister={openSignupModal}
            />
            
            <SignupModal
                open={modal.type === MODAL_TYPES.SIGNUP}
                onClose={closeModal}
                onswitchToLogin={openLoginModal}
            />

            <VerifyModal
                open={modal.type === MODAL_TYPES.VERIFY}
                onClose={closeModal}
                email={modal?.data?.email}
            />
        </>
    )
}
