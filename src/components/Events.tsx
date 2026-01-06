export type Event = {
  text: string;
  year: number;
};

type EventsProps = {
  events: Event[];
  title: string;
  sortOrder: "asc" | "desc";
};

export default function Events({ title, events, sortOrder }: EventsProps) {
  return (
    <div id="blog-posts">
      <h1>{title}</h1>
      <p>
        Currently sorted by{" "}
        {sortOrder === "asc" ? "Oldest First" : "Newest First"}
      </p>
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
