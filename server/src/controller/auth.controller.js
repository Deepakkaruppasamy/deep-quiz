const express = require('express')
const router = express.Router()
const User=require("../model/auth.model.js")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to protect admin routes
function adminAuth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not an admin' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/login', (req, res) => {
    const {  email, password } = req.body
       User.findOne({email:email},(err,user)=>{
           if(user){
                if(password===user.password){
                  console.log("login successfull")
                  // Issue JWT
                  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
                  res.send({ message:"Login Succesfully", user: user, isAdmin: user.isAdmin, token })
                }else{
                    res.send({message:"Invalid Password"})
                }
           }else{
            res.send({message:"User Not Regitered "})
           }
       })
})
router.post('/register', (req, res) => {
  const { name, email, password, isAdmin } = req.body
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: 'User Already Registered' })
    } else {
      const user = new User({
        name,
        email,
        password,
        isAdmin: isAdmin || false,
      })
      user.save((err) => {
        if (err) {
          res.send(err)
        } else {
          res.send({ message: 'Successfully Registered' })
        }
      })
    }
  })
})
//  ------------ get data of user by admin controller-----------
router.get('/getuser', async (req, res) => {
  try {
    const data = await User.find({}).lean().exec()
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
  }
})

//  ------------delete user by admin controller-----------

router.delete('/:id',async (req, res) => {
  User.deleteOne({_id:req.params.id}).then(()=>{
   res.send("user deleted")
  }).catch((err) => {
   res.send("An error Occured")
  })
})

// Get user profile image by email
router.get('/get-user-profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profileImage: user.profileImage || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router