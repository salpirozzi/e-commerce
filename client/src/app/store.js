import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';
import chartReducer from '../reducers/chartSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        chart: chartReducer
    }
});
