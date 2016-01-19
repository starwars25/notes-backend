module.exports = function(req, res, next) {
    if (req.currentUser) {
        next();
    } else {
        res.sendStatus(401);
    }
};