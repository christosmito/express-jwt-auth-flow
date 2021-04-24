const express = require("express");
require("dotenv").config({ path: "./.env" });

const userRouter = require("./router/userRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.status(200).json({
        status: "success"
    });
});

app.use("/users", userRouter);

module.exports = app;