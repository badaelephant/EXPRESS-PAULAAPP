const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["DAILY", "WEEKLY", "YEARLY", "CUSTOM"],
        //DAILY : 매일 몇시 몇분(hour, min) - default 알람 5분전
        //WEEKLY : 매주 무슨요일(day) - default 알람 당일 오전 9시
        //YEARLY : 매년 몇월 며칠(month, date) - default 알람 당일 오전 9시
        //Custom : 몇년 몇월 며칠(date:year, month, date) - default 알람 당일 오전 9시
    },
    hour: Number,
    minute: Number,
    day: Number,
    //monday~sunday : 1~7
    date: Date,
    isAlrarm: {
        type: Boolean,
        default: 0,
    },
    userId: String,
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = { Schedule };
