import { createSlice } from '@reduxjs/toolkit';

const dailyTipSlice = createSlice({
    name: 'dailyTip',
    initialState: {
        tip: '',
        lastUpdated: null
    },
    reducers: {
        setDailyTip: (state, action) => {
            state.tip = action.payload.tip;
            state.lastUpdated = action.payload.date;
        }
    }
});

export const { setDailyTip } = dailyTipSlice.actions;
export default dailyTipSlice.reducer;