const mongoose = require("mongoose")


const shotSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    video:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likeCount:{
        type: Number,
        default: 0
    },
    saveCount:{
        type: Number,
        default: 0
    },
    commentCount:{
        type: Number,
        default: 0
    }

},{
    timestamps: true
})

const shotModel = mongoose.model("shot", shotSchema)

module.exports = shotModel;