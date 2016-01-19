process.env.NODE_ENVIRONMENT = 'test';
var should = require('should');
var model = require('../../model');
var helper = require('../../helpers/test_helper');
var request = require('../../helpers/request_helper');
var util = require('util');
describe('notes_controller', function () {
    var instances;
    before(function (done) {
        helper.seed('password', function (err, res) {
            instances = res;
            done();
        });
    });
    describe('index', function () {
        // Not logged in
        // Ok
        it('should return 401', function (done) {
            request({
                method: 'GET',
                path: '/notes'
            }, function (res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 200', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    method: 'GET',
                    path: '/notes',
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(200);
                    var json = JSON.parse(res.data);
                    json[0].theme.should.eql(instances.notes[0].theme);
                    done();
                });
            });
        });
    });
    describe('show', function () {
        // Not logged in
        // Wrong user
        // No such note
        // Ok
        it('should return 401', function (done) {
            request({
                method: 'GET',
                path: '/notes/' + instances.notes[0].id
            }, function (res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 404', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    method: 'GET',
                    path: '/notes/' + 999999,
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(404);
                    done();
                });
            });
        });
        it('should return 403', function (done) {
            helper.logInUser(instances.users[1], 'token', function (err) {
                request({
                    method: 'GET',
                    path: '/notes/' + instances.notes[0].id,
                    headers: {
                        'user-id': instances.users[1].id.toString(),
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(403);
                    done();
                });
            });
        });
        it('should return 200', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    method: 'GET',
                    path: '/notes/' + instances.notes[0].id,
                    headers: {
                        'user-id': instances.users[0].id.toString(),
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(200);
                    var json = JSON.parse(res.data);
                    json.theme.should.eql(instances.notes[0].theme);

                    done();
                });
            });
        });
    });
    describe('create', function () {
        var validNote = function () {
            return {
                note: {
                    theme: 'TestTheme',
                    content: 'TestContent'
                }
            }
        };
        // Not logged in
        // Invalid params
        // OK
        it('should return 401', function (done) {
                request({
                    method: 'POST',
                    path: '/notes',
                    data: validNote()
                }, function (res) {
                    res.status.should.eql(401);
                    done();
                });
        });

        it('should return 400', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                var p = validNote();
                p.note.content = 'aaa';
                request({
                    method: 'POST',
                    path: '/notes',
                    data: p,
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(400);
                    done();
                });
            });

        });
        it('should return 201', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    method: 'POST',
                    path: '/notes',
                    data: validNote(),
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(201);
                    done();
                });
            });

        });
    });
    describe('update', function () {
        // Not logged in
        // No such note
        // Wrong user
        // Wrong input
        // OK
        var validNote = function () {
            return {
                note: {
                    theme: 'AnotherTestTheme'
                }
            }
        };
        it('should return 401', function (done) {
            request({
                path: util.format('/notes/%d', instances.notes[0].id),
                method: 'PUT',
                data: validNote()
            }, function (res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 404', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    path: util.format('/notes/%d', 999999),
                    method: 'PUT',
                    data: validNote(),
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(404);
                    done();
                });
            });
        });
        it('should return 403', function (done) {
            helper.logInUser(instances.users[1], 'token', function (err) {
                request({
                    path: util.format('/notes/%d', instances.notes[0].id),
                    method: 'PUT',
                    data: validNote(),
                    headers: {
                        'user-id': instances.users[1].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(403);
                    done();
                });
            });
        });
        it('should return 400', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                var p = validNote();
                p.note.theme = 'Aaa';
                request({
                    path: util.format('/notes/%d', instances.notes[0].id),
                    method: 'PUT',
                    data: p,
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(400);
                    done();
                });
            });
        });
        it('should return 200', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                var p = validNote();
                request({
                    path: util.format('/notes/%d', instances.notes[0].id),
                    method: 'PUT',
                    data: validNote(),
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(200);
                    done();
                });
            });
        });
    });
    describe('delete', function() {
        // Not logged in
        // No such note
        // Wrong user
        // OK
        it('should return 401', function (done) {
            request({
                path: util.format('/notes/%d', instances.notes[0].id),
                method: 'DELETE'
            }, function (res) {
                res.status.should.eql(401);
                done();
            });
        });
        it('should return 404', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    path: util.format('/notes/%d', 999999),
                    method: 'DELETE',
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(404);
                    done();
                });
            });
        });
        it('should return 403', function (done) {
            helper.logInUser(instances.users[1], 'token', function (err) {
                request({
                    path: util.format('/notes/%d', instances.notes[0].id),
                    method: 'DELETE',
                    headers: {
                        'user-id': instances.users[1].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(403);
                    done();
                });
            });
        });

        it('should return 200', function (done) {
            helper.logInUser(instances.users[0], 'token', function (err) {
                request({
                    path: util.format('/notes/%d', instances.notes[0].id),
                    method: 'DELETE',
                    headers: {
                        'user-id': instances.users[0].id,
                        'token': 'token'
                    }
                }, function (res) {
                    res.status.should.eql(200);
                    done();
                });
            });
        });
    });
});