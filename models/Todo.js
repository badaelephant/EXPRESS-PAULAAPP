const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    text: String,
    isDone: {
        type: Boolean,
        default: 0,
    },
    userId: String,
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = { Todo };
