const express = require('express');
const router = express.Router();
const open = require('open');

router.post('/', async (req, res) => {
     open('http://192.168.178.27:8888/player', {app: 'firefox'});
});

module.exports = router;