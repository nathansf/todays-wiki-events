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
      <ul>
        {events.map((event) => (
          <ul key={event.text}>
            <p>
              {event.text} {event.year}
            </p>
          </ul>
        ))}
      </ul>
    </div>
  );
}
