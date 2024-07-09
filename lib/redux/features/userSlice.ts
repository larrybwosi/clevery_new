import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

export interface UserState {
  user: User ; 
}


const initialState: UserState = {
  user:{
    _id: '',
    name:'',
    email: '',
    username:'',
    emailVerified: false,  
    phoneNumber: '',
    image: '',
  } 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = undefined; 
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;