import Spinner from "@/_components/spinner/spinner";
import styles from "./chatListSkeleton.module.css";

const SKELETON_ITEMS = [
  { width: "72%" },
  { width: "58%" },
  { width: "84%" },
  { width: "65%" },
  { width: "76%" },
];

export default function ChatListSkeleton() {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-label="Cargando chats">
      <div className={styles.spinnerRow}>
        <Spinner size="sm" label="Cargando chats" />
        <span className={styles.loadingText}>Cargando chats...</span>
      </div>

      <span className={`${styles.sectionLabelSkeleton} ${styles.shimmer}`} />

      <ul className={styles.list}>
        {SKELETON_ITEMS.map((item, index) => (
          <li
            key={index}
            className={styles.item}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <span className={`${styles.iconSkeleton} ${styles.shimmer}`} />
            <span
              className={`${styles.titleSkeleton} ${styles.shimmer}`}
              style={{ width: item.width }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
