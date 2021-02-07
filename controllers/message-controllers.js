const Message = require('../models/message');
const { check, validationResult } = require('express-validator');
const { format } = require('date-fns');

function createMessagePageGet(req, res) {
    res.render('create-message');
};

const createMessagePagePost = [
    check('title').isLength({ min: 1, max: 80 }).escape(),
    check('message').isLength({ min: 5, max: 500 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return next(errors); }

        const newMessage = new Message({
            title: req.body.title,
            body: req.body.message,
            author: req.user.id,
            timestamp: format(new Date(), 'yyyy-MM-dd @ H:mm aa')
        });

        newMessage.save(function(err, message) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
];

function displayMessagesPageGet(req, res, next) {
    Message.find(function(err, messages) {
        if (err) { next(err); }
        console.log(messages);
        res.render('messages', { title: 'Members Only | All Messages', messages });
    });
};

module.exports = { createMessagePageGet, createMessagePagePost, displayMessagesPageGet };