const sample = require('lodash.sample');
async function getRandomTrack(userName, spotifyApi, track) {
    const data = await spotifyApi.getUserPlaylists(userName)
    let tracks = [];
    for await (let playlist of data.body.items) {
        const data = await spotifyApi.getPlaylistTracks(playlist.id, {
            offset: 1,
            limit: 100,
            fields: 'items'
        });

        for await (let track_obj of data.body.items) {
            const song = track_obj.track
            tracks.push({url: song.uri, duration: song.duration_ms});
        }
        track.push(sample(tracks));
    }
}

module.exports = getRandomTrack;
