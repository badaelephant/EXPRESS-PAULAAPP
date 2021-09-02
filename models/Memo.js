const mongoose = require("mongoose");

const memoSchema = mongoose.Schema({
    title: String,
    text: String,
    userId: String,
});
const Memo = mongoose.model("Memo", memoSchema);
module.exports = { Memo };
