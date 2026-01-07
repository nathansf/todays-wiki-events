import { type ReactNode, useMemo } from "react";

import Events from "../components/Events.tsx";
import ErrorModal from "../components/ErrorModal.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import {
  fetchBirthdays,
  setCurrentPage,
  toggleSortOrder,
  clearError,
} from "../store/birthdaysSlice.ts";
import styles from "./EventsPage.module.css";

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
    content = (
      <ErrorModal text={error} onClose={() => dispatch(clearError())} />
    );
  }

  if (birthdays.length > 0) {
    const now = new Date();
    const monthName = now.toLocaleString("en-US", { month: "long" });
    const day = now.getDate();
    content = (
      <div>
        <Events
          events={paginatedBirthdays}
          title={`Birthdays for Today (${monthName} ${day})`}
          sortOrder={sortOrder}
          onToggleSort={handleToggleSort}
        />
      </div>
    );
    paginationControls = (
      <div className={styles.paginationControls}>
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
      <div className={styles.emptyState}>
        <p>Click button to retrieve Wikipedia birthdays for today's date</p>
        <button onClick={handleFetch}>Fetch Today's Birthdays</button>
      </div>
    );
  }

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  return (
    <main>
      {content}
      {buttonContent}
      {paginationControls}
    </main>
  );
}
