const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const getMyData = require('../spotifyGetters/userData');
const getRandomTrack = require('../spotifyGetters/tracks');
let trackInfo = [];

router.get('/:token', async (req, res) => {
    const spotifyApi = new SpotifyWebApi();
    const token = req.params.token;
    spotifyApi.setAccessToken(token);
    await getMyData(spotifyApi, trackInfo, getRandomTrack);
    res.send(trackInfo);
});

module.exports = router;