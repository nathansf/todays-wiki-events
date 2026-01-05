export type Event = {
  text: string;
  year: number;
};

type EventsProps = {
  events: Event[];
  title: string;
};

export default function Events({ title, events }: EventsProps) {
  return (
    <div id="blog-posts">
      <h1>{title}</h1>
      <ul>
        {events.map((event) => (
          <ul key={event.text}>
            <h2>{event.year}</h2>
            <p>{event.text}</p>
          </ul>
        ))}
      </ul>
    </div>
  );
}
