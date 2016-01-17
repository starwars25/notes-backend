process.env.NODE_ENVIRONMENT = 'test';
var model = require('../../model');
var async = require('async');
var should = require('should');
var helper = require('../../helpers/test_helper');
var instances;
var validNote = function () {
    return {
        content: 'This is a test note',
        theme: 'Test Note',
        UserId: instances.users[0].id
    }
};
describe('note_model', function () {
    before(function (done) {
        helper.seed('token', function (err, res) {
            instances = res;
            done();
        });
    });
    it('should test presence of theme', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            delete params.theme;
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test min length of theme', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            params.theme = 'Aja';
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test max length of theme', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            var string = '';
            for(var i = 0; i < 110; i++) string += 'a';
            params.theme = string;
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test presence of content', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            delete params.content;
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test min length of content', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            params.content = 'Hello';
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test max length of content', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            var string = '';
            for(var i = 0; i < 150; i++) string += 'a';
            params.content = string;
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should test presence of UserId', function(done) {
        model.Note.count().then(function(before) {
            var params = validNote();
            delete params.UserId;
            model.Note.create(params).catch(function(error) {
                model.Note.count().then(function(now) {
                    before.should.eql(now);
                    done();
                });
            });
        });
    });
    it('should be valid', function(done) {
        model.Note.count().then(function(before) {

            var params = validNote();
            console.log(params);
            model.Note.create(params).then(function(note) {
                model.Note.count().then(function(now) {
                    before.should.eql(now - 1);
                    done();
                });
            });
        });
    });

});