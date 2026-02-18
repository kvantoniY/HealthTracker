import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserId } from '@/entities/user/model/types';

interface UsersState {
  favorites: UserId[];
  filters: { search: string };
}

const initialState: UsersState = {
  favorites: [],
  filters: { search: '' },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<UserId>) => { /* ... */ },
    setSearchFilter: (state, action: PayloadAction<string>) => { /* ... */ },
  },
});

export default usersSlice.reducer;
export const { toggleFavorite, setSearchFilter } = usersSlice.actions;