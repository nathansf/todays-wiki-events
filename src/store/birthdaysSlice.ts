import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type Event } from "../components/Events.tsx";
import { get } from "../utils/http.ts";

type RawDataEvents = {
  text: string;
  year: number;
};

type ApiResponse = {
  births: RawDataEvents[];
};

interface BirthdaysState {
  birthdays: Event[];
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: BirthdaysState = {
  birthdays: [],
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
  error: null,
};

export const fetchBirthdays = createAsyncThunk(
  "birthdays/fetchBirthdays",
  async () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const data = (await get(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`
    )) as ApiResponse;

    const events: Event[] = data.births.map((rawPost) => {
      return { text: rawPost.text, year: rawPost.year };
    });

    return events;
  }
);

const birthdaysSlice = createSlice({
  name: "birthdays",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBirthdays.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBirthdays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.birthdays = action.payload;
        state.currentPage = 1; // Reset to first page when new data is fetched
      })
      .addCase(fetchBirthdays.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch birthdays";
      });
  },
});

export const { setCurrentPage, setItemsPerPage } = birthdaysSlice.actions;
export default birthdaysSlice.reducer;
