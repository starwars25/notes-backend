var model = require('../model');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
module.exports = function (app) {
    app.post('/users', bodyParser.json(), function (req, res) {
        //var options = {
        //    nickname: req.body.user.nickname,
        //    password: req.body.user.password,
        //    password_confirmation: req.body.user.password_confirmation
        //};
        if (req.body.user) {
            if (req.body.user.password && req.body.user.password_confirmation && req.body.user.password === req.body.user.password_confirmation && req.body.user.password.length > 4) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.user.password, salt, function (err, hash) {
                        var options = {
                            nickname: req.body.user.nickname,
                            password_digest: hash
                        };
                        model.User.create(options).then(function (user) {
                            var crypto = require('crypto');
                            crypto.randomBytes(64, function(err, buf) {
                                var token = buf.toString('hex');
                                bcrypt.hash(token, salt, function(err, hash) {
                                    user.update({token_digest: hash}).then(function(user) {
                                        res.status(201).json({
                                            user_id: user.id,
                                            token: token
                                        });
                                    }).catch(function(error) {
                                        console.log(error);
                                    }) ;
                                });
                            });

                        }).catch(function (error) {
                            console.log(error);
                            res.sendStatus(400);
                        });

                    });
                });
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(400);
        }

    });
};