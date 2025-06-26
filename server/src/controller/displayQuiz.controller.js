const express=require("express")
const User = require("../model/auth.model.js")
const router =express.Router()
const path = require('path');

const Postquiz=require("../model/quizdata.model.js")

router.get("/",async(req,res)=>{
    try{
const Postquizdata=await Postquiz.find().lean().exec()
res.send(Postquizdata)
    }catch(err){
return res.status(500).send(err.message)
    }
})

router.get('/:topic', async (req, res) => {
    try {
        const quiz = await Postquiz.findOne({ topic: req.params.topic }).lean().exec();
        if (!quiz) {
            return res.status(404).send({ message: "Quiz not found" });
        }
        res.send(quiz);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

module.exports = router