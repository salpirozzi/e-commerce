import { createSlice } from '@reduxjs/toolkit';
import { axios } from '../core/axios';

export const chartSlice = createSlice({
    name: 'chart',
    initialState: {
        items: [],
        items_count: 0
    },
    reducers: {
        remove: (state, action) => {
            let index = state.items.findIndex(x => x.item === action.payload);
            state.items.splice(index, 1);
            state.items_count--;
        },
        add: (state, action) => {
            let index = state.items.findIndex(x => x.item === action.payload.item);
            if(index === -1) {
                axios.post("chart/add", {
                    owner_id: action.payload.owner,
                    product: action.payload.item,
                    amount: action.payload.amount
                });
            }
            //else state.items[index].amount += action.payload.amount;
            updateChart(state, action);
        },
        updateItems: (state, action) => updateChart(state, action)
    }
});

const updateChart = (state, action) => {
    let index = state.items.findIndex(x => x.item === action.payload.item);
    if(index === -1) {
        state.items.push(action.payload.item);
    }
    else state.items[index].amount += action.payload.amount;
    state.items_count += action.payload.amount;
}

export const { add, remove, updateItems } = chartSlice.actions;

export const getCount = state => state.chart.items_count;
export const getItems = state => state.chart.items;

export default chartSlice.reducer;
