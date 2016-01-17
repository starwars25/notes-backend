process.env.NODE_ENVIRONMENT = 'test';
var should = require('should');
var model = require('../../model');
var helper = require('../../helpers/test_helper');
var request = require('../../helpers/request_helper');
describe('users_controller', function() {
    var instances;
    before(function(done) {
        helper.seed('password', function(err, res) {
            instances = res;
            done();
        });
    });
    describe('create', function() {
        // no password
        // passwords do not match
        // too short password
        // invalid params
        // ok
        it ('should return 400: no password', function(done) {
            request({
                method: 'POST',
                path: '/users',
                data: {
                    user: {
                        nickname: 'starwars25'
                    }
                }
            }, function(res) {
                res.status.should.eql(400);
                done();
            });
        });
        it ('should return 400: passwords do not match', function(done) {
            request({
                method: 'POST',
                path: '/users',
                data: {
                    user: {
                        nickname: 'starwars25',
                        password: 'valid_password',
                        password_confirmation: 'invalid'
                    }
                }
            }, function(res) {
                res.status.should.eql(400);
                done();
            });
        });
        it ('should return 400: password too short', function(done) {
            request({
                method: 'POST',
                path: '/users',
                data: {
                    user: {
                        nickname: 'starwars25',
                        password: 'exa',
                        password_confirmation: 'exa'
                    }
                }
            }, function(res) {
                res.status.should.eql(400);
                done();
            });
        });
        it ('should return 400: invalid data', function(done) {
            request({
                method: 'POST',
                path: '/users',
                data: {
                    user: {
                        nickname: 'dog',
                        password: 'valid_password',
                        password_confirmation: 'valid_password'
                    }
                }
            }, function(res) {
                res.status.should.eql(400);
                done();
            });
        });
        it ('should return 201', function(done) {
            request({
                method: 'POST',
                path: '/users',
                data: {
                    user: {
                        nickname: 'starwars25',
                        password: 'valid_password',
                        password_confirmation: 'valid_password'
                    }
                }
            }, function(res) {
                res.status.should.eql(201);
                var body = JSON.parse(res.data);
                body.token.should.not.eql(undefined);
                body.user_id.should.not.eql(undefined);
                done();
            });
        });
    });
});