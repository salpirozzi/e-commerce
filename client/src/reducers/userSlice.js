import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios, setBearer } from '../core/axios';

export const update = createAsyncThunk(
    'users/update',
    async(user_id, thunkAPI) => {
        const response = await axios.post('/user/update', { id: user_id });
        return response.data;
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null
    },
    reducers: {
        logout: (state) => { 
            state.data = null; 
            localStorage.removeItem("token");
            setBearer();
        },
        login: (state, action) => changeData(state, action)
    },
    extraReducers: {
        [update.fulfilled]: (state, action) => changeData(state, action)
    }
});

const changeData = (state, action) => {
    action.payload.user['token'] = action.payload.token;
    state.data = action.payload.user;
    localStorage.setItem("token", action.payload.token);
    setBearer(action.payload.token);
}

export const { login, logout } = userSlice.actions;

export const getUser = state => state.user.data;

export default userSlice.reducer;
