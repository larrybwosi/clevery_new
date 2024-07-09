import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { image, Search } from '@/types';


interface SearchState {
  searches: Search[];
}

const initialState: SearchState = {
  searches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<Search>) => {
      state.searches.push(action.payload);
    },
    removeSearch: (state, action: PayloadAction<string>) => {
      const index = state.searches.findIndex(
        (search) => search._id === action.payload
      );
      if (index !== -1) {
        state.searches.splice(index, 1);
      }
    },
    clearSearch: (state) => {
      state.searches = [];
    },
  },
});

export const { addSearch, removeSearch, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;