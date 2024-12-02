import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import dailyTipReducer from './features/dailyTipSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        dailyTip: dailyTipReducer,
    },
});

export default store;