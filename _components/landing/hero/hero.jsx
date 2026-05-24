"use client";

import Link from "next/link";
import { useAuth } from "@/_contexts/authContext";
import { useModal } from "@/_contexts/modalContext";
import styles from "./hero.module.css";

export default function Hero() {
  const { user } = useAuth();
  const { openLoginModal, openSignupModal } = useModal();

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow}>Asistente financiero inteligente</p>

        <h1 className={styles.title}>
          ¿Qué deseas{" "}
          <span className={styles.accent}>financiar</span> hoy?
        </h1>

        <p className={styles.subtitle}>
          Tu asistente inteligente de Serfinanzas para presupuestos, ahorro,
          créditos e inversiones.
        </p>

        <div className={styles.ctaGroup}>
          {user ? (
            <Link href="/chat" className={styles.primaryCta}>
              Abrir chat
            </Link>
          ) : (
            <>
              <button
                type="button"
                className={styles.primaryCta}
                onClick={openSignupModal}
              >
                Comenzar gratis
              </button>
              <button
                type="button"
                className={styles.secondaryCta}
                onClick={openLoginModal}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
