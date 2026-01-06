import { type ReactNode, useMemo } from "react";

import Events from "../components/Events.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { fetchBirthdays, setCurrentPage } from "../store/birthdaysSlice.ts";

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

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(birthdays.length / itemsPerPage);
  }, [birthdays.length, itemsPerPage]);

  const handleFetch = () => {
    dispatch(fetchBirthdays());
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  let content: ReactNode;
  let buttonContent: ReactNode;
  let paginationControls: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (birthdays.length > 0) {
    content = <Events events={paginatedBirthdays} title="Today's Birthdays" />;
    paginationControls = (
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
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
      {paginationControls}
    </main>
  );
}
