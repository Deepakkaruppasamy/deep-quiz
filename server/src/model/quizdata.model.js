const mongoose = require('mongoose')

const questionArr = new mongoose.Schema({
  title: { type: String },
  questions: { type: String },
  options: [{ option: String, isCorrect: Boolean, id: Number }],
  correctAnswer: { type: String },
});
const postQuizSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  timer: { type: Number }, // in seconds or minutes
  questionArray: [questionArr],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostQuiz = mongoose.model("PostQuiz", postQuizSchema);

module.exports=PostQuiz