const express = require('express');
const passport = require('passport');

const router = express.Router();


router.post('/', passport.authenticate('local', {
    failureFlash: true
}), (req, res) => {
    res.status(201).json({ message: 'Logged in' });
});

module.exports = router;