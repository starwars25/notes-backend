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
            users: []
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
    }
};