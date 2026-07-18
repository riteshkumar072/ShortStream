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

const saveModel = mongoose.model('save',saveSchema)


module.exports = saveModel