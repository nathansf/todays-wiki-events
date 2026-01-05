import { type ReactNode, useCallback, useState } from "react";

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

  const fetchPosts = useCallback(async () => {
    setIsFetching(true);
    setError(undefined);
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const data = (await get(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`
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
  }, []);

  let content: ReactNode;
  let buttonContent: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedEvents) {
    content = <Events events={fetchedEvents} title="Today's Birthdays" />;
  } else if (!isFetching) {
    buttonContent = (
      <button onClick={fetchPosts}>Fetch Today's Birthdays</button>
    );
  }

  if (isFetching) {
    content = <p>Fetching posts...</p>;
  }

  return (
    <main>
      {content}
      {buttonContent}
    </main>
  );
}

export default App;
