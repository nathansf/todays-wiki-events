import { type ReactNode, useMemo } from "react";

import Events from "../components/Events.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import {
  fetchBirthdays,
  setCurrentPage,
  toggleSortOrder,
} from "../store/birthdaysSlice.ts";

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { birthdays, isLoading, error, currentPage, itemsPerPage, sortOrder } =
    useAppSelector((state) => state.birthdays);

  // Sort birthdays by year
  const sortedBirthdays = useMemo(() => {
    const sorted = [...birthdays];
    sorted.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.year - a.year; // Newest first (descending)
      }
      return a.year - b.year; // Oldest first (ascending)
    });
    return sorted;
  }, [birthdays, sortOrder]);

  // Calculate paginated birthdays
  const paginatedBirthdays = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedBirthdays.slice(startIndex, endIndex);
  }, [sortedBirthdays, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(sortedBirthdays.length / itemsPerPage);
  }, [sortedBirthdays.length, itemsPerPage]);

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

  const handleToggleSort = () => {
    dispatch(toggleSortOrder());
  };

  let content: ReactNode;
  let buttonContent: ReactNode;
  let paginationControls: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (birthdays.length > 0) {
    content = (
      <Events
        events={paginatedBirthdays}
        title="Today's Birthdays"
        sortOrder={sortOrder}
      />
    );
    paginationControls = (
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleToggleSort}>
          Sort by {sortOrder === "asc" ? "Newest First" : "Oldest First"}
        </button>
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
