process.env.NODE_ENVIRONMENT = 'test';
var model = require('../model');
var async = require('async');
module.exports = {
    truncate: function(callback) {
        var models = [model.User];
        async.each(models, function(item, callback) {
            item.truncate().then(function() {
                callback();
            }).catch(function(error) {
                callback(error);
            });
        }, function(err) {
            if (err) callback(err);
            else callback();
        });
    }
};