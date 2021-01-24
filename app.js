const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const views = require('./routes/views');
const playlists = require('./routes/getPlaylists');
const randomTracks = require('./routes/getRandomTrack');
const player = require('./routes/playTrack');
const open = require('open');

const cors = require('cors');
const corsOptions = {
    exposedHeaders: 'x-auth-token',
};

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

const spotifyApi = new SpotifyWebApi({
    clientId: '88f06d3080d943afaa42dcc0dd89ba40',
    clientSecret: 'a87d614ad3694bd5ad7909f62cec8516',
    redirectUri: 'http://192.168.178.27:8888/callback'
});


const app = express();
let token = null;
let refresh = null;

app.use(cors(corsOptions));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/', views);
app.use('/playlists', playlists);
app.use('/random', randomTracks);
app.use('/player', player);

app.get('/token' , (req, res) => {
    res.send({token: token, refresh: refresh});
});

app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            token = access_token;
            refresh = expires_in / 2 * 1000;
            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );
            res.send('Success! You can now close the window.');

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                token = access_token;
                refresh = expires_in / 2 * 1000;
                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 900);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });
});

app.listen(8888,'192.168.178.27', () => {
        open('http://192.168.178.27:8888/login', {app: 'google chrome'})
    }
);


