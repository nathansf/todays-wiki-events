import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import birthdaysReducer from "../store/birthdaysSlice";
import EventsPage from "./EventsPage";

function renderWithStore(preloaded?: {
  birthdays: ReturnType<typeof birthdaysReducer>;
}) {
  const store = configureStore({
    reducer: { birthdays: birthdaysReducer },
    preloadedState: preloaded,
  });

  return render(
    <Provider store={store}>
      <EventsPage />
    </Provider>
  );
}

describe("EventsPage", () => {
  it("renders birthdays from state", () => {
    renderWithStore({
      birthdays: {
        birthdays: [{ text: "Ada Lovelace", year: 1815 }],
        currentPage: 1,
        itemsPerPage: 10,
        isLoading: false,
        error: null,
        sortOrder: "desc",
      },
    });

    expect(screen.getByText(/Ada Lovelace/i)).toBeInTheDocument();
  });

  it("pagination button changes page (if you have Next/Prev)", async () => {
    const user = userEvent.setup();

    renderWithStore({
      birthdays: {
        birthdays: Array.from({ length: 25 }, (_, i) => ({
          text: `P${i}`,
          year: 2000 + i,
        })),
        currentPage: 1,
        itemsPerPage: 10,
        isLoading: false,
        error: null,
        sortOrder: "asc",
      },
    });

    // Click the enabled "Next" button (there may also be a disabled one in the DOM)
    const nextButton = screen
      .getAllByRole("button", { name: /^next$/i })
      .find((b) => !b.hasAttribute("disabled"));

    expect(nextButton).toBeDefined();
    await user.click(nextButton!);

    // page 2 should contain P10
    expect(await screen.findByText(/^P10\b/i)).toBeInTheDocument();

    // confirm we are on page 2
    expect(screen.getByText(/Page 2 of 3/i)).toBeInTheDocument();

    // confirm page 1 item is no longer shown
    expect(screen.queryByText(/^P0\b/i)).not.toBeInTheDocument();
  });
});
