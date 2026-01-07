# Nathan Frankel - Levelpath FE Take-home assignment

Implement a list of today's birthdays using the Wikipedia ["On this day" API](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day).

## Local Development Setup / Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run test` - Run tests (Vitest)

### To see error / loading states

- Change request url in birthdaysSlice.ts to see error state
- Set slow network connection in devtools to see loading state if necessary.

## Design decisions

- Created 'EventsPage' instead of 'BirthdaysPage' since a future enhancement could be to add holidays, deaths, or selected events
- Changing sort order jumps back to page one
- Decided on Redux Toolkit (RTK) for global state (less boilerplate, createAsyncThunk for simplified async logic)

## Future enhancements

- Revise names to link to content_urls (open in new tab)
- Add thumbnail image for each entry (if it exists)
- Display extract_html for each entry, either with an expandable div or in a modal on click
- Skip to first or last page of paginated results
- Style for mobile first and make responsive at all resolutions (now styled for desktop primarily)
- Add pre-commit hook to prevent committing failing tests
