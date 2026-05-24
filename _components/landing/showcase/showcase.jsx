import Image from "next/image";
import styles from "./showcase.module.css";

const SCREENS = [
  {
    src: "/imagen-1.png",
    alt: "Vista general de Serfi IA con chat y sidebar",
    label: "Interfaz completa",
    caption: "Chat y panel lateral en un solo lugar.",
  },
  {
    src: "/imagen-2.png",
    alt: "Pantalla principal de Serfi IA en móvil",
    label: "Experiencia móvil",
    caption: "Diseño limpio, listo para consultar al instante.",
  },
  {
    src: "/imagen%203.png",
    alt: "Sidebar de Serfi IA con chats recientes",
    label: "Historial inteligente",
    caption: "Retoma conversaciones y gestiona tus chats.",
  },
];

export default function Showcase() {
  return (
    <section id="showcase" className={styles.showcase}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Producto</p>
        <h2 className={styles.title}>Diseñado para decidir mejor</h2>
        <p className={styles.subtitle}>
          Una experiencia oscura, minimalista y enfocada en lo que importa:
          tus finanzas.
        </p>
      </div>

      <div className={styles.grid}>
        {SCREENS.map((screen, index) => (
          <article
            key={screen.src}
            className={styles.card}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={screen.src}
                alt={screen.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
              />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>{screen.label}</span>
              <p className={styles.caption}>{screen.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
