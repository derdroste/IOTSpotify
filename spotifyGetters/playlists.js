async function getUserPlaylists(userName, spotifyApi, playlists) {
    const data = await spotifyApi.getUserPlaylists(userName)
    for await (let playlist of data.body.items) {
        playlists.push(playlist.name);
    }
}

module.exports = getUserPlaylists;
