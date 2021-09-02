const express = require("express");
const app = express();
app.listen(5000, () => {
    console.log("Server Started on 5000");
});
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//DB Setting
const key = require("./config/key");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { Memo } = require("./models/Memo");
const { Schedule } = require("./models/Schedule");
const { Todo } = require("./models/Todo");
mongoose
    .connect(key.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully Connected to MongoDB"))
    .catch((err) => console.error(err));

//api

app.get("/api/users/home", (req, res) => {
    console.log("MainPageIn");
});

app.post("/api/users", (req, res) => {
    User.findOne({ email: req.body.email }, (err, userInfo) => {
        if (userInfo) {
            return res.json({
                loginSuccess: false,
                message: `you already registerd. your password is ${userInfo.password}, try  again`,
            });
        } else {
            const user = new User(req.body);
            user.save((err, userInfo) => {
                if (err) return res.json({ success: false, err });
                res.status(200).json({ success: true });
            });
        }
    });
});
app.post("/api/users/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "there is no user with same email",
            });
        }
        if (user.password !== req.body.password) {
            return res.json({
                loginSuccess: false,
                message: "wrong password. please try again",
            });
        }
        res.cookie("userId", user._id)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
    });
});
app.get("/api/users/my", (req, res) => {
    const userId = req.cookies.userId;
    User.findById(userId, (err, userInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            user: userInfo,
        });
    });
});
app.patch("/api/users/my", (req, res) => {
    const userId = req.cookies.userId;
    User.findByIdAndUpdate(userId, req.body, (err, userInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.delete("/api/users/my", (req, res) => {
    const userId = req.cookies.userId;
    User.findById(userId, (err, user) => {
        if (err) return res.json({ success: false, err });
        Memo.deleteMany({ userId: userId }, (err, memo) => {
            if (err) return res.json({ success: false, err });
            console.log("Memo Deleted");
        });
        Schedule.deleteMany({ userId: userId }, (err, memo) => {
            if (err) return res.json({ success: false, err });
            console.log("Schedule Deleted");
        });
        Todo.deleteMany({ userId: userId }, (err, memo) => {
            if (err) return res.json({ success: false, err });
            console.log("Todo Deleted");
        });
        user.deleteOne((err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({ success: true });
        });
    });
    res.clearCookie("userId");
});

app.post("/api/memos", (req, res) => {
    const userId = req.cookies.userId;
    const { title, text } = req.body;
    const memo = new Memo({ title, text, userId });
    memo.save((err, memo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, memoId: memo._id });
    });
});
app.patch("/api/memos/:id", (req, res) => {
    const memoId = req.params.id;
    Memo.findByIdAndUpdate(memoId, req.body, (err, memoInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.delete("/api/memos/:id", (req, res) => {
    const memoId = req.params.id;
    Memo.findByIdAndDelete(memoId, (err, memoInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.get("/api/memos/:id", (req, res) => {
    const memoId = req.params.id;
    Memo.findById(memoId, (err, memoInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            memo: memoInfo,
        });
    });
});
app.get("/api/memos", (req, res) => {
    const userId = req.cookies.userId;
    Memo.find({ userId }, (err, memos) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            memos: memos,
        });
    });
});

app.post("/api/todos", (req, res) => {
    const userId = req.cookies.userId;
    const todo = new Todo({ text: req.body.text, userId });
    todo.save((err, todo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, todoId: todo._id });
    });
});
app.patch("/api/todos/:id", (req, res) => {
    const todoId = req.params.id;
    Todo.findByIdAndUpdate(todoId, req.body, (err, todoInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.delete("/api/todos/:id", (req, res) => {
    const todoId = req.params.id;
    Todo.findByIdAndDelete(todoId, (err, todoInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.get("/api/todos", (req, res) => {
    const userId = req.cookies.userId;
    Todo.find({ userId }, (err, todos) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            todos: todos,
        });
    });
});

app.post("/api/schedules", (req, res) => {
    const userId = req.cookies.userId;
    const schedule = new Schedule(req.body);
    schedule.userId = userId;
    schedule.save((err, schedule) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.delete("/api/schedules/:id", (req, res) => {
    const scheduleId = req.params.id;
    Schedule.findByIdAndDelete(scheduleId, (err, schedule) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});
app.get("/api/schedules", (req, res) => {
    const userId = req.cookies.userId;
    let type = req.body.type;
    let filter = [];
    if (!type) {
        filter = [{ userId }];
    } else {
        filter = [{ userId }, { type }];
    }

    Schedule.find({ $and: filter }, (err, schedules) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            schedules: schedules,
        });
    });
});
