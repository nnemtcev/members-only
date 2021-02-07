var express = require('express');
var router = express.Router();

const messageControllers = require('../controllers/message-controllers');

router.get('/', messageControllers.displayMessagesPageGet);
router.get('/create-message', messageControllers.createMessagePageGet);
router.post('/create-message', messageControllers.createMessagePagePost);
router.get('/message/delete/:id', messageControllers.deleteMessage);

module.exports = router;
