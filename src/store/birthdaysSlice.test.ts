import { describe, expect, it } from "vitest";
import reducer, { setCurrentPage, setItemsPerPage } from "./birthdaysSlice";
import type { BirthdaysState } from "./birthdaysSlice";

const base: BirthdaysState = {
  birthdays: [],
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
  error: null,
  sortOrder: "desc",
};

describe("birthdaysSlice reducers", () => {
  it("setCurrentPage updates page", () => {
    const next = reducer(base, setCurrentPage(3));
    expect(next.currentPage).toBe(3);
  });

  it("setItemsPerPage updates itemsPerPage and resets currentPage", () => {
    const next = reducer({ ...base, currentPage: 5 }, setItemsPerPage(25));
    expect(next.itemsPerPage).toBe(25);
    expect(next.currentPage).toBe(1);
  });
});
