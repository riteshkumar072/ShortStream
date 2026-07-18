const mongoose = require('mongoose')


const commentSchema = new  mongoose.Schema({
    text:{
        type: String,
        required: true,
        trim: true
    },
    shotId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shot',
        required: true
    },
    commentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{
    timestamps: true
})

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel