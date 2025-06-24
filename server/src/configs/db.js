const mongoose = require('mongoose')
require("dotenv").config()
mongoose.set('strictQuery', true); // Suppress deprecation warning
module.exports = () => {
 mongoose.connect(
    process.env.DATABASE
  )
}
