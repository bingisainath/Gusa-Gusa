import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: '',
  peerId: '',
  user: {
    _id: '',
    name: '',
    email: '',
    profile_pic: '',
  },
  onlineUser: [],
  socketConnection: null,
  AllUser: [], // Store individual conversations
  AllGroups: [], // Store group conversations
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user._id = action.payload._id;
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      // state.peerId = action.payload.peerId;
      state.user.profile_pic = action.payload.profile_pic;
      state.token = action.payload.token;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, action) => {
      state._id = '';
      state.name = '';
      state.email = '';
      state.profile_pic = '';
      state.token = '';
      state.peerId = '';
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
    setAllUser: (state, action) => {
      state.AllUser = action.payload;
    },
    setAllGroups: (state, action) => {
      state.AllGroups = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setToken,
  logout,
  setOnlineUser,
  setSocketConnection,
  setMyPeerData,
  setReceiverPeerData,
  setAllUser,
  setAllGroups,
} = userSlice.actions;

export default userSlice.reducer;
