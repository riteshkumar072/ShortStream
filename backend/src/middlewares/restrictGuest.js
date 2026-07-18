function restrictGuest(req, res, next) {
    if (req.user && req.user.role === "guest") {
        return res.status(403).json({ success: false })
    }
    next();
}

module.exports = restrictGuest;