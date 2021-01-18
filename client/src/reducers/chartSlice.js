import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from '../core/axios';

export const updateItems = createAsyncThunk(
    'chart/update',
    async(user_id, thunkAPI) => {
        const response = await axios.post('/chart/get', { id: user_id });
        return response.data;
    }
)

export const add = createAsyncThunk(
    'chart/add',
    async(data, thunkAPI) => {
        const response = await axios.post("chart/add", {
            owner_id: data.owner,
            product: data.item,
            amount: data.amount
        });
        thunkAPI.dispatch(updateItems(data.owner));
        return response.data;
    }
)

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
        }
    },
    extraReducers: {
        [updateItems.fulfilled]: (state, action) => updateChart(state, action)
    }
});

const updateChart = (state, action) => {
    let amount = 0;

    action.payload.forEach(x =>  {
        const index = state.items.findIndex(p => p.item._id === x.product._id);
        if(index === -1) {
            const obj = {
                amount: x.amount,
                item: x.product
            };
            state.items.push(obj);
        }
        else state.items[index].amount += x.amount;
        amount += x.amount;
    });
    
    state.items_count = amount;
}

export const { remove } = chartSlice.actions;

export const getCount = state => state.chart.items_count;
export const getItems = state => state.chart.items;

export default chartSlice.reducer;
