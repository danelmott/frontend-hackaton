"use client";

import Link from "next/link";
import { useAuth } from "@/_contexts/authContext";
import { useModal } from "@/_contexts/modalContext";
import styles from "./cta.module.css";

export default function Cta() {
  const { user } = useAuth();
  const { openLoginModal, openSignupModal } = useModal();

  return (
    <section className={styles.cta}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          Empieza a{" "}
          <span className={styles.accent}>financiar</span> con inteligencia
        </h2>
        <p className={styles.subtitle}>
          Crea tu cuenta en segundos y accede a tu asistente financiero
          personalizado.
        </p>

        <div className={styles.actions}>
          {user ? (
            <Link href="/chat" className={styles.primaryBtn}>
              Ir al chat
            </Link>
          ) : (
            <>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={openSignupModal}
              >
                Crear cuenta
              </button>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={openLoginModal}
              >
                Ya tengo cuenta
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
