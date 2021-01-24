async function getMyData(spotifyApi, items, callback) {
    const me = await spotifyApi.getMe();
    await callback(me.body.id, spotifyApi, items);
}

module.exports = getMyData;
