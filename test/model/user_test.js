process.env.NODE_ENVIRONMENT = 'test';
var model = require('../../model');
var async = require('async');
var should = require('should');
var helper = require('../../helpers/test_helper');
var validUser = function () {
    return {
        nickname: 'starwars25',
        password_digest: 'aaaa'
    }
};
describe('user_model', function () {
    before(function(done) {
        helper.truncate(function(err) {
            if (err) {
                console.log(err);
                done();
            } else {
                console.log('Database truncated.');
                done();
            }
        });
    });
    it('should validate presence of nickname', function (done) {
        var beforeCount;
        model.User.count().then(function(count) {
            beforeCount = count;
            var params = validUser();
            delete params.nickname;
            model.User.create(params).catch(function(error) {
                model.User.count().then(function(count) {
                    beforeCount.should.eql(count);
                    done();
                });
            });
        });
    });
    it('should validate length of nickname', function(done) {
        var beforeCount;
        model.User.count().then(function(count) {
            beforeCount = count;
            var params = validUser();
            params.nickname = 'Aja';
            model.User.create(params).catch(function(error) {
                model.User.count().then(function(count) {
                    beforeCount.should.eql(count);
                    done();
                });
            });
        });
    });
    it('should validate password digest', function (done) {
        var beforeCount;
        model.User.count().then(function(count) {
            beforeCount = count;
            var params = validUser();
            delete params.password_digest;
            model.User.create(params).catch(function(error) {
                model.User.count().then(function(count) {
                    beforeCount.should.eql(count);
                    done();
                });
            });
        });
    });
    it('should create user', function(done) {
        var beforeCount;
        model.User.count().then(function(count) {
            beforeCount = count;
            var params = validUser();
            model.User.create(params).then(function(user) {
                model.User.count().then(function(count) {
                    beforeCount.should.eql(count - 1);
                    done();
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function(error) {
                console.log(error);
            })
        });
    });
    it ('should validate uniqueness of nickname', function(done) {
        var beforeCount;
        model.User.count().then(function(count) {
            beforeCount = count;
            var params = validUser();
            model.User.create(params).catch(function(error) {
                model.User.count().then(function(count) {
                    beforeCount.should.eql(count);
                    done();
                });
            });
        });
    });
});