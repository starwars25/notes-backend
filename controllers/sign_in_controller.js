var model = require('../model');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
module.exports = function (app) {
    app.post('/sign-in', bodyParser.json(), function (req, res) {
        if (req.body.user && req.body.user.nickname && req.body.user.password) {
            model.User.findOne({
                where: {
                    nickname: req.body.user.nickname
                }
            }).then(function(instance) {
                if (instance) {
                    bcrypt.compare(req.body.user.password, instance.password_digest, function(err, result) {
                        if (result) {
                            var crypto = require('crypto');
                            crypto.randomBytes(64, function(err, buf) {
                                var token = buf.toString('hex');
                                bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(token, salt, function(err, hash) {
                                        instance.update({token_digest: hash}).then(function(user) {
                                            res.status(200).json({
                                                user_id: user.id,
                                                token: token
                                            });
                                        }).catch(function(error) {
                                            console.log(error);
                                            res.sendStatus(500);
                                        }) ;
                                    });
                                });

                            });
                        } else {
                            res.sendStatus(400);

                        }
                    });
                } else {
                    res.sendStatus(404);
                }
            }).catch(function(error) {
                console.log(error);
                res.sendStatus(500);
            });
        } else {
            res.sendStatus(400);
        }
    });
};