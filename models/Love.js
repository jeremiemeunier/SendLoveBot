const mongoose = require("mongoose");

const love = mongoose.model("Love", {
    hours: String,
    minutes: String,
    user_id: String
});

module.exports = love;