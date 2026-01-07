import styles from "./Events.module.css";

export type Event = {
  text: string;
  year: number;
};

type EventsProps = {
  events: Event[];
  title: string;
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
};

export default function Events({
  title,
  events,
  sortOrder,
  onToggleSort,
}: EventsProps) {
  return (
    <div id="blog-posts">
      <h2>{title}</h2>
      <button onClick={onToggleSort}>
        Sort by {sortOrder === "asc" ? "Newest First" : "Oldest First"}
      </button>
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={`${event.text}-${event.year}`} className={styles.row}>
            <span className={styles.year}>{event.year}</span>
            <span className={styles.text}>{event.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
