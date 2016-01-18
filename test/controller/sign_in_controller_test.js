process.env.NODE_ENVIRONMENT = 'test';
var should = require('should');
var model = require('../../model');
var helper = require('../../helpers/test_helper');
var request = require('../../helpers/request_helper');
describe('sign_in_controller', function() {
    var instances;
    before(function(done) {
        helper.seed('valid_password', function(err, res) {
            instances = res;
            done();
        });
    });
    describe('sign_in', function() {
        // No such user
        // Passwords do not match
        // OK

        it('should return 404', function(done) {
            request({
                method: 'POST',
                path: '/sign-in',
                data: {
                    user: {
                        nickname: 'invalid',
                        password: 'valid_password'
                    }
                }
            }, function(response) {
                response.status.should.eql(404);
                done();
            });
        });
        it('should return 400', function(done) {
            request({
                method: 'POST',
                path: '/sign-in',
                data: {
                    user: {
                        nickname: instances.users[0].nickname,
                        password: 'invalid_password'
                    }
                }
            }, function(response) {
                response.status.should.eql(400);
                done();
            });
        });
        it('should return 200', function(done) {
            request({
                method: 'POST',
                path: '/sign-in',
                data: {
                    user: {
                        nickname: instances.users[0].nickname,
                        password: 'valid_password'
                    }
                }
            }, function(response) {
                response.status.should.eql(200);
                var res = JSON.parse(response.data);
                res['user_id'].should.eql(instances.users[0].id);
                res['token'].should.not.eql(null);
                done();
            });
        });
    });
});