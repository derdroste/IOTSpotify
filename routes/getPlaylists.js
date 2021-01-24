const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const getMyData = require('../spotifyGetters/userData');
const getMyPlaylists = require('../spotifyGetters/playlists');
let playlists = [];

router.get('/:token', async (req, res) => {
    playlists = [];
    const spotifyApi = new SpotifyWebApi();
    const token = req.params.token;
    spotifyApi.setAccessToken(token);
    await getMyData(spotifyApi, playlists, getMyPlaylists);
    res.send(playlists);
});

module.exports = router;