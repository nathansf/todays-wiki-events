import { type ReactNode, useMemo } from "react";

import Events from "../components/Events.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { fetchBirthdays } from "../store/birthdaysSlice.ts";

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { birthdays, isLoading, error, currentPage, itemsPerPage } =
    useAppSelector((state) => state.birthdays);

  // Calculate paginated birthdays
  const paginatedBirthdays = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return birthdays.slice(startIndex, endIndex);
  }, [birthdays, currentPage, itemsPerPage]);

  const handleFetch = () => {
    dispatch(fetchBirthdays());
  };

  let content: ReactNode;
  let buttonContent: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (birthdays.length > 0) {
    content = <Events events={paginatedBirthdays} title="Today's Birthdays" />;
  } else if (!isLoading) {
    buttonContent = (
      <button onClick={handleFetch}>Fetch Today's Birthdays</button>
    );
  }

  if (isLoading) {
    content = <p>Fetching posts...</p>;
  }

  return (
    <main>
      {content}
      {buttonContent}
    </main>
  );
}
