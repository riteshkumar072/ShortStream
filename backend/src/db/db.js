const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database connected");
        
    }).catch((err) =>{
        console.log("Database connetion errorr");
    })
}

module.exports = connectDB