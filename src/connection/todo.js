const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: String},
    completed: {type: Boolean, default: false},
    date: {type: Date, default: new Date},
    delete: {type: Boolean, default: false},
});

module.exports = mongoose.model('todo', todoSchema);
