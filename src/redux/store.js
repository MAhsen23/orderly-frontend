import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import dailyTipReducer from './features/dailyTipSlice';
import notesReducer from './features/notesSlice';


const store = configureStore({
    reducer: {
        user: userReducer,
        dailyTip: dailyTipReducer,
        notes: notesReducer,
    },
});

export default store;