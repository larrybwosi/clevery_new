import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types';

interface ProfileState {
  profile: Profile;
}

const initialState: ProfileState = {
  profile: {
    name: 'Guest Doe',
    _id: '',
    username: 'janedoe',
    email:'',
    image:'',
    bio:'',
    friends: [],
    country: '',
    bannerImage:undefined,
    streamToken:''
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
