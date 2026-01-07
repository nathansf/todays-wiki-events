import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import reducer, { fetchBirthdays } from "./birthdaysSlice";

// Mock the http helper used by the thunk
vi.mock("../utils/http.ts", () => ({
  get: vi.fn(),
}));

import { get } from "../utils/http.ts";

describe("fetchBirthdays thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores birthdays on success and resets page", async () => {
    // Arrange: mock API response shape used in birthdaysSlice.ts
    vi.mocked(get).mockResolvedValue({
      births: [
        { text: "Ada Lovelace", year: 1815 },
        { text: "Alan Turing", year: 1912 },
      ],
    });

    const store = configureStore({
      reducer: { birthdays: reducer },
      preloadedState: {
        birthdays: {
          birthdays: [],
          currentPage: 5, // prove reset happens
          itemsPerPage: 10,
          sortOrder: "desc" as const,
          isLoading: false,
          error: "old error",
        },
      },
    });

    // Act
    const promise = store.dispatch(fetchBirthdays());

    // Assert pending state (optional but nice)
    expect(store.getState().birthdays.isLoading).toBe(true);
    expect(store.getState().birthdays.error).toBe(null);

    await promise;

    // Assert fulfilled state
    const state = store.getState().birthdays;
    expect(state.isLoading).toBe(false);
    expect(state.currentPage).toBe(1);
    expect(state.birthdays).toEqual([
      { text: "Ada Lovelace", year: 1815 },
      { text: "Alan Turing", year: 1912 },
    ]);
  });

  it("sets error on failure", async () => {
    vi.mocked(get).mockRejectedValue(new Error("Failed to fetch data."));

    const store = configureStore({
      reducer: { birthdays: reducer },
    });

    await store.dispatch(fetchBirthdays());

    const state = store.getState().birthdays;
    expect(state.isLoading).toBe(false);
    expect(state.error).toMatch(/failed to fetch data/i);
  });
});
