var model = require('../model');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var currentUser = require('../middleware/current_user');
var notLoggedIn = require('../middleware/not_logged_in');

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
    app.get('/users', currentUser, notLoggedIn, function(req, res) {
        res.status(200).json(req.currentUser);
    });
    app.put('/users/:id', bodyParser.json(), currentUser, notLoggedIn, function(req, res) {
         model.User.findOne({
             where: {
                 id: req.params.id
             }
         }).then(function(user) {
             if (user) {
                 if (user.id === req.currentUser.id) {
                     if (req.body.user) {
                         var p = {};
                         if(req.body.user.nickname) p.nickname = req.body.user.nickname;
                         user.update(p).then(function(user) {
                             res.sendStatus(200);
                         }).catch(function(error) {
                             res.sendStatus(400);
                         })
                     } else {
                         res.sendStatus(400);
                     }
                 } else {
                     res.sendStatus(403);
                 }
             } else {
                 res.sendStatus(404);
             }
         }).catch(function(error) {
             console.log(error);
             res.sendStatus(500);
         });
    });
};