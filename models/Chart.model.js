const mongoose = require('mongoose');

const ChartModel = mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    amount: Number,
    created_at: {type: Date, default: Date.now}
});

const Chart = mongoose.model('charts', ChartModel);

module.exports = Chart;