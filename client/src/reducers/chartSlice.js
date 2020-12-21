import { createSlice } from '@reduxjs/toolkit';

export const chartSlice = createSlice({
    name: 'chart',
    initialState: {
        items: [],
        items_count: 0
    },
    reducers: {
        remove: (state, action) => {
            let index = state.items.findIndex(x => x._id === action.payload);
            state.items.splice(index, 1);
            state.items_count--;
        },
        add: (state, action) => {
            state.items.push(action.payload);
            state.items_count++;
        }
    }
});

export const { add, remove } = chartSlice.actions;

export const getCount = state => state.chart.items_count;
export const getItems = state => state.chart.items;

export default chartSlice.reducer;
