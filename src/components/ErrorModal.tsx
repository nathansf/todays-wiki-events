import styles from "./ErrorModal.module.css";

type ErrorModalProps = {
  text: string;
  onClose: () => void;
};

export default function ErrorModal({ text, onClose }: ErrorModalProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>An error occurred!</h2>
        <p>{text}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Dismiss
        </button>
      </aside>
    </div>
  );
}
