require('./environment')();
var model = require('./model');
var async = require('async');
var models = [model.User];
async.each(models, function(item, callback) {
    item.sync({force: true}).then(function() {
        callback();
    }).catch(function(error) {
        callback(error);
    });
}, function(err) {
    if(err) console.log(err);
    else console.log('Database created.');
});