const mongoose = require('mongoose');
const url = "mongodb://127.0.0.1/todo_list";

async function connect() {
    try {
        await mongoose.connect(url);
        console.log("Connected successfully!!!");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connect };
