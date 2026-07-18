const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');



const attachUserInteractions = async (shotsArray, userId) => {
    if (!shotsArray || shotsArray.length === 0) return [];

    if (!userId) {
        return shotsArray.map(shot => {
            const plainShot = shot.toObject ? shot.toObject() : (shot._doc || shot);
            
            return {
                ...plainShot,
                isLiked: false,
                isSaved: false,
            };
        })
    }
    
    const [userLikes, userSaves] = await Promise.all([
        likeModel.find({ user: userId }).select('shot').lean(),
        saveModel.find({ user: userId }).select('shot').lean()
    ])

    const likeIds = new Set(userLikes.map(like => like.shot.toString()))
    const saveIds = new Set(userSaves.map(save => save.shot.toString()))
    
    
    return shotsArray.map(shot => {
        const plainShot = shot.toObject ? shot.toObject() : (shot._doc || shot);

            return {
                ...plainShot,
                isLiked: likeIds.has(plainShot._id.toString()),
                isSaved: saveIds.has(plainShot._id.toString())
            }
        })
    }

    module.exports = { attachUserInteractions }