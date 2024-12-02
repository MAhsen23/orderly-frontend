import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notes: [],
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload.slice(0, 5);
        },
        addNote: (state, action) => {
            if (state.notes.length < 5) {
                state.notes.push(action.payload);
            }
        },
        updateNote: (state, action) => {
            const { index, text } = action.payload;
            if (index >= 0 && index < state.notes.length) {
                state.notes[index] = text;
            }
        },
        removeNote: (state, action) => {
            state.notes.splice(action.payload, 1);
        },
        clearNotes: (state) => {
            state.notes = [];
        },
    },
});

export const { setNotes, addNote, updateNote, removeNote, clearNotes } = notesSlice.actions;
export default notesSlice.reducer;