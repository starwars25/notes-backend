process.env.NODE_ENVIRONMENT = 'test';
var model = require('../model');
var async = require('async');
var bcrypt = require('bcrypt');
module.exports = {
    truncate: function (callback) {
        var models = [model.User];
        async.each(models, function (item, callback) {
            item.truncate().then(function () {
                callback();
            }).catch(function (error) {
                callback(error);
            });
        }, function (err) {
            if (err) callback(err);
            else callback();
        });
    },
    seed: function (token, callback) {
        var instances = {
            users: [],
            notes: []
        };
        var token_digest;
        async.series([
            function (callback) {
                // Truncate tables
                var models = [model.User];
                async.each(models, function (item, callback) {
                    item.truncate().then(function () {
                        callback();
                    }).catch(function (error) {
                        callback(error);
                    });
                }, function (err) {
                    if (err) callback(err);
                    else callback();
                });
            },

            function (callback) {
                // create token digest
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(token, salt, function (err, hash) {
                        token_digest = hash;
                        callback();
                    });
                });
            },
            function (callback) {
                // seed tables
                async.series([
                    function (callback) {
                        // create users
                        var users = [{
                            nickname: 'TestUser1',
                            password_digest: token_digest
                        }, {
                            nickname: 'TestUser2',
                            password_digest: token_digest
                        }];
                        async.eachSeries(users, function (item, callback) {
                            model.User.create(item).then(function (user) {
                                console.log(user.id);
                                instances.users.push(user);
                                callback();
                            }).catch(function (err) {
                                callback(err);
                            });
                        }, function (err) {
                            if (err) callback(err);
                            else callback(err);
                        });
                    },
                    function (callback) {
                        var notes = [{
                            theme: 'TestTheme0',
                            content: 'TestContent0',
                            UserId: instances.users[0].id
                        }, {
                            theme: 'TestTheme1',
                            content: 'TestContent1',
                            UserId: instances.users[0].id
                        }, {
                            theme: 'TestTheme2',
                            content: 'TestContent2',
                            UserId: instances.users[1].id
                        }];
                        async.eachSeries(notes, function(item, callback) {
                            model.Note.create(item).then(function(note) {
                                instances.notes.push(note);
                                callback();
                            }).catch(function(error) {
                                callback(error);
                            });
                        }, function(err) {
                            if (err) callback(err);
                            else callback();
                        });
                    }
                ], function (err, results) {
                    if (err) callback(err);
                    else callback();
                });
            }
        ], function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, instances);
            }

        });
    },
    logInUser: function(user, token, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(token, salt, function(err, hash) {
                user.update({token_digest: hash}).then(function(user) {
                    callback();
                }).catch(function(error) {
                    callback(error);
                });
            });
        });
    }
};