const express = require('express');
const router = express.Router();

router.get('/player', (req, res) => {
    res.render('player', {
        title: 'Player'
    });
});

module.exports = router;