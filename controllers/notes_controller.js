var model = require('../model');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var currentUser = require('../middleware/current_user');
var notLoggedIn = require('../middleware/not_logged_in');
module.exports = function (app) {
    app.get('/notes', currentUser, notLoggedIn, function(req, res) {
        model.Note.findAll({
            where: {
                UserId: req.currentUser.id
            }
        }).then(function(notes) {
            res.status(200).json(notes);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });
    app.get('/notes/:id', currentUser, notLoggedIn, function(req, res) {
        model.Note.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(note) {
            if (note) {
                if (note.UserId === req.currentUser.id) {
                    res.status(200).json(note);
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });
    app.post('/notes', bodyParser.json(), currentUser, notLoggedIn, function(req, res) {
        console.log(req.body);
        var p = {};
        if (req.body.note) {
            if (req.body.note.theme) p.theme = req.body.note.theme;
            if (req.body.note.content) p.content = req.body.note.content;
            p.UserId = req.currentUser.id;
            console.log(p);
            model.Note.create(p).then(function(note) {
                res.sendStatus(201);
            }).catch(function(error) {
                console.log(error);
                res.sendStatus(400);
            })
        } else {
            res.sendStatus(400);
        }
    });
    app.put('/notes/:id', bodyParser.json(), currentUser, notLoggedIn, function(req, res) {
        model.Note.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(note) {
            if (note) {
                if (note.UserId === req.currentUser.id) {
                    var p = {};
                    if (req.body.note) {
                        if (req.body.note.theme) p.theme = req.body.note.theme;
                        if (req.body.note.content) p.theme = req.body.note.content;
                        p.UserId = req.currentUser.id;
                        note.update(p).then(function(note) {
                            res.sendStatus(200);
                        }).catch(function(error) {
                            console.log(error);
                            res.sendStatus(400);
                        });
                    } else {
                        res.sendStatus(400);
                    }
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });

    });
    app.delete('/notes/:id', currentUser, notLoggedIn, function(req, res) {
        model.Note.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(note) {
            if (note) {
                if (note.UserId === req.currentUser.id) {
                    note.destroy().then(function() {
                        res.sendStatus(200);
                    }).catch(function(error) {
                        console.log(error);
                        res.sendStatus(500);
                    });
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });

    });

};