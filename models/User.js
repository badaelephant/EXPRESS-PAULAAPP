const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    image: String,
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
