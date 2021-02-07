var express = require('express');
var router = express.Router();

const authControllers = require('../controllers/auth-controllers');

router.get('/sign-up', authControllers.signUpPageGet);
router.post('/sign-up', authControllers.signUpPagePost);
router.get('/sign-in', authControllers.signInPageGet);
router.get('/sign-out', authControllers.signOutGet);

router.get('/become-member', authControllers.becomeMemberPageGet);
router.post('/become-member', authControllers.becomeMemberPagePost);

module.exports = router;
