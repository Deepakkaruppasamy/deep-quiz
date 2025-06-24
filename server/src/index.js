const express = require('express');
const connect = require("./configs/db.js");
const bodyParser = require("body-parser");
const Port = process.env.PORT || 3755;
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginAuth = require("./controller/auth.controller.js");
app.use("/", loginAuth);

const quizAdd = require("./controller/quizAdd.controller.js");
app.use("/admin", quizAdd);
app.use("/api/quiz", quizAdd);

const displayQuiz = require("./controller/displayQuiz.controller.js");
app.use("/quiz", displayQuiz);

const user = require("./controller/auth.controller.js");
app.use("/user", user);

const userResult = require("./controller/userData.controller.js");
app.use("/userResult", userResult);

const contactController = require("./controller/contact.controller.js");
app.use("/contact", contactController);

const feedbackController = require("./controller/feedback.controller.js");
app.use("/feedback", feedbackController);

const certificateController = require("./controller/certificate.controller.js");
app.use("/certificate", certificateController);

const chatbotController = require("./controller/chatbot.controller.js");
app.use("/chatbot", chatbotController);

app.listen(Port, async function () {
    try {
        await connect();
        console.log(`Listening on ${Port}`);
    } catch (error) {
        console.log(error);
    }
});


