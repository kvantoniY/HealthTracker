import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsersState {

}

const initialState: UsersState = {

};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

  },
});

export default usersSlice.reducer;
export const {  } = usersSlice.actions;