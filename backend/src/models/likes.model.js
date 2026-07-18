const mongoose = require("mongoose")


const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    shot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shot',
        required: true
    }
})

const likeModel = mongoose.model("like", likeSchema)

module.exports = likeModel;