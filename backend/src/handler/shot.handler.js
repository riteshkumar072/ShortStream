const shotModel = require('../models/shot.model')
const likeModel = require('../models/likes.model')
const saveModel = require('../models/save.model')
const storageService = require("../services/storage.service")
const { v4: uuid } = require('uuid')
const { response } = require('express')
const { set, default: mongoose } = require('mongoose')
const { attachUserInteractions } = require('../utils/videoHelper')
const commentModel = require('../models/comment.model')


async function createShot(req, res) {

    const MAX_SIZE_20MB = 20 * 1024 * 1024;
    if(req.file.size > MAX_SIZE_20MB){
        return res.status(400).json({
            message: "Video size is more than 20 MB. Request blocked!"
        })
    }


    const fileUploadResult = await storageService.uploadFile(req.file.buffer.toString('base64'), uuid() + ".mp4")


    const shot = await shotModel.create({
        description: req.body.description,
        video: fileUploadResult.url,
        createdBy: req.user._id
    })

    res.status(201).json({
        message: "shot created Succesfully",
        shot: shot
    })

}


async function getShot(req, res) {
    const user = req.user;
    const { targetId } = req.query;
    let finalFeed = []

    if (targetId) {
        const anchorShot = await shotModel.findById(targetId);
        if (anchorShot) {
            finalFeed.push(anchorShot)
        }
        const randomShots = await shotModel.aggregate([
            { $match: { _id: { $ne: new mongoose.Types.ObjectId(targetId) } } },
            { $sample: { size: 9 } }
        ])
        finalFeed = [...finalFeed, ...randomShots]
    }
    else {
        finalFeed = await shotModel.aggregate([
            { $sample: { size: 10 } }
        ])
    }

    finalFeed = await shotModel.populate(finalFeed, { path: 'createdBy', select: 'name profileImage' })

    const updatedFinalFeed = await attachUserInteractions(finalFeed, user._id)

    res.status(200).json({
        message: "shot  fetched successfully",
        shot: updatedFinalFeed
    })

}

async function likeShot(req, res) {
    const { shotId } = req.body
    const user = req.user;
    console.log(req.body);
    console.log(shotId);

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        shot: shotId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            shot: shotId
        })

        await shotModel.findByIdAndUpdate(shotId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "shot unliked successfully"
        })

    }

    const like = await likeModel.create({
        user: req.user._id,
        shot: shotId
    })

    await shotModel.findByIdAndUpdate(shotId, {
        $inc: { likeCount: +1 }
    })

    res.status(201).json({
        message: "shot liked successfully",
        like
    })
}


async function saveShot(req, res) {
    const { shotId } = req.body
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        shot: shotId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            shot: shotId
        })

        await shotModel.findByIdAndUpdate(shotId, {
            $inc: { saveCount: -1 }
        })

        return res.status(200).json({
            message: "shot unsaved successfully"
        })

    }

    const save = await saveModel.create({
        user: req.user._id,
        shot: shotId
    })

    await shotModel.findByIdAndUpdate(shotId, {
        $inc: { saveCount: +1 }
    })

    res.status(201).json({
        message: "shot saved successfully",
        save
    })
}


async function getSavedShot(req, res) {
    const user = req.user
    const savedRecord = await saveModel.find({ user: user._id }).populate('shot').lean();

    if (!savedRecord || savedRecord.length === 0) {
        return res.status(404).json({ message: "No saved shots founds" })
    }
    //1st map se record se pr shot ko nikalaaa a aur firrr filter kr diya unn shot koo jiska vlaur  null hai agr kisi reason video delte ke baad bhi data reh gya ho shot  model me
    const rawShots = savedRecord.map(item => item.shot).filter(shot => shot !== null);

    const updatedSavedShots = await attachUserInteractions(rawShots, user._id)

    res.status(200).json({
        message: "Saved shots retrivedd suvessfully",
        savedShot: updatedSavedShots
    })
}


async function deleteShot(req, res) {
    const { shotId } = req.params;
    const user = req.user

    const shot = await shotModel.findOne({
        _id: shotId,
        createdBy: user._id,
    })
    if (!shot) {
        return res.status(404).json({
            message: "Shot not found or unauthorized to delete!"
        });
    }

    await shotModel.deleteOne({
        _id: shotId,
        createdBy: user._id
    })
    await likeModel.deleteMany({ shot: shotId });
    await saveModel.deleteMany({ shot: shotId });
    res.status(200).json({
        message: "Shot deleted succecfully"
    })
}


async function createComment(req, res) {
    try {
        const { shotId } = req.body;

        const comment = await commentModel.create({
            text: req.body.text,
            shotId: shotId,
            commentBy: req.user._id,
        });

        await comment.populate('commentBy', 'name profileImage');

        await shotModel.findByIdAndUpdate(shotId, {
            $inc: { commentCount: 1 }
        });

        res.status(201).json({
            message: "Comment created",
            comment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getComment(req, res) {
    try {
        const { shotId } = req.params;

        const comment = await commentModel.find({ shotId })
            .populate('commentBy', 'name profileImage')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            message: "comments fetched successfully",
            comment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createShot, getShot, likeShot, saveShot, getSavedShot, deleteShot, createComment, getComment }