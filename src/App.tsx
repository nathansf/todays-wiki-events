import { type ReactNode, useEffect, useState } from "react";

import Events, { type Event } from "./components/Events.tsx";
import { get } from "./utils/http.ts";
import "./App.css";
import ErrorMessage from "./components/ErrorMessage.tsx";

type RawDataEvents = {
  text: string;
  year: number;
};

type ApiResponse = {
  births: RawDataEvents[];
};

function App() {
  const [fetchedEvents, setFetchedEvents] = useState<Event[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        // TODO: Change to use current date
        const data = (await get(
          "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/01/04"
        )) as ApiResponse;

        const events: Event[] = data.births.map((rawPost) => {
          return { text: rawPost.text, year: rawPost.year };
        });

        setFetchedEvents(events);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
      setIsFetching(false);
    }

    fetchPosts();
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedEvents) {
    content = <Events events={fetchedEvents} title="Today's Birthdays" />;
  }

  if (isFetching) {
    content = <p>Fetching posts...</p>;
  }

  return <main>{content}</main>;
}

export default App;
