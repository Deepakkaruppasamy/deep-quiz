const express = require("express");
const router = express.Router();
const PostQuiz = require("../model/quizdata.model.js");

router.post("/", async (req, res) => {
  try {
    const data = await PostQuiz.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:value", async (req, res) => {
  try {
    const Data = await PostQuiz.find({ title: req.params.value });
    res.status(200).json(Data);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await PostQuiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Edit a quiz by id
router.put("/:id", async (req, res) => {
  try {
    const updatedQuiz = await PostQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedQuiz);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a quiz by id
router.delete("/:id", async (req, res) => {
  try {
    await PostQuiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Add a question to a quiz
router.post('/:id/question', async (req, res) => {
  try {
    const quiz = await PostQuiz.findById(req.params.id);
    quiz.questionArray.push(req.body);
    await quiz.save();
    res.status(200).json(quiz);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Edit a question in a quiz
router.put('/:id/question/:qidx', async (req, res) => {
  try {
    const quiz = await PostQuiz.findById(req.params.id);
    quiz.questionArray[req.params.qidx] = req.body;
    await quiz.save();
    res.status(200).json(quiz);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a question from a quiz
router.delete('/:id/question/:qidx', async (req, res) => {
  try {
    const quiz = await PostQuiz.findById(req.params.id);
    quiz.questionArray.splice(req.params.qidx, 1);
    await quiz.save();
    res.status(200).json(quiz);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
