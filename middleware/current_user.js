var model = require('../model');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
    if(req.headers['token'] && req.headers['user-id']) {
        model.User.findOne({
            where: {
                id: req.headers['user-id']
            }
        }).then(function(user) {
            if (user) {
                bcrypt.compare(req.headers['token'], user.token_digest, function(err, result) {
                    if (err) {
                        console.log(err);
                        next();
                    } else {
                        if (result) {
                            req.currentUser = user;
                            next();
                        } else {
                            next();
                        }
                    }
                });
            } else {
                next();
            }
        }).catch(function(error) {
            console.log(error);
            next();
        });
    } else {
        next();
    }
};