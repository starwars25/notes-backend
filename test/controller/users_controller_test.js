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
    describe('update', function() {
        // not logged in
        // wrong user
        // invalid params
        // ok
        var valid = {
            user: {
                nickname: 'starwars255'
            }
        };
        it('should return 401', function(done) {
            request({
                method: 'PUT',
                path: '/users/' + instances.users[0].id,
                data: valid
            }, function(res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 403', function(done) {
            helper.logInUser(instances.users[1], 'token', function(err) {
                request({
                    method: 'PUT',
                    path: '/users/' + instances.users[0].id,
                    data: valid,
                    headers: {
                        'user-id': instances.users[1].id.toString(),
                        'token': 'token'
                    }
                }, function(res) {
                    res.status.should.eql(403);
                    done();
                });
            });
        });
        it('should return 404', function(done) {
            helper.logInUser(instances.users[1], 'token', function(err) {
                request({
                    method: 'PUT',
                    path: '/users/' + 999999,
                    data: valid,
                    headers: {
                        'user-id': instances.users[1].id.toString(),
                        'token': 'token'
                    }
                }, function(res) {
                    res.status.should.eql(404);
                    done();
                });
            });
        });
        it('should return 400', function(done) {
            helper.logInUser(instances.users[0], 'token', function(err) {
                request({
                    method: 'PUT',
                    path: '/users/' + instances.users[0].id,
                    data: {
                        user: {
                            'nickname': 'aaa'
                        }
                    },
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function(res) {
                    res.status.should.eql(400);
                    done();
                });
            });
        });
        it('should return 200', function(done) {
            helper.logInUser(instances.users[0], 'token', function(err) {
                request({
                    method: 'PUT',
                    path: '/users/' + instances.users[0].id,
                    data: valid,
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function(res) {
                    res.status.should.eql(200);
                    instances.users[0].reload().then(function(user) {
                        done();

                    });
                });
            });
        });
    });
    describe('get', function() {
        // not logged in
        // ok
        it('should return 401', function(done) {
            request({
                method: 'GET',
                path: '/users',
                data: {}
            }, function(res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 200', function(done) {
            helper.logInUser(instances.users[0], 'token', function(err) {
                request({
                    method: 'GET',
                    path: '/users',
                    data: {},
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function(res) {
                    res.status.should.eql(200);
                    var json = JSON.parse(res.data);
                    json.nickname.should.eql(instances.users[0].nickname);
                    done();
                });
            });
        });
    });
});