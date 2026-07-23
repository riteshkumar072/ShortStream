const mongoose = require('mongoose')

const saveSchema = new mongoose.Schema({
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


saveSchema.index({user:1, shot:1}, {unique: true})

const saveModel = mongoose.model('save',saveSchema)
module.exports = saveModel