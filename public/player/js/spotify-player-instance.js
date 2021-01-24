window.onSpotifyWebPlaybackSDKReady = async () => {

    let token;
    let track;
    let duration;

    const getToken = async () => {
        const res = await fetch(`http://192.168.178.27:8888/token`);
        const data = await res.json();
        token = data.token;
    }

    const getTrack = async () => {
        const res = await fetch(`http://192.168.178.27:8888/random/${token}`);
        const data = await res.json();
        track = data[0].url;
        duration = data[0].duration;
        console.log(duration)
        setTimeout(() => {
            window.close();
        }, duration);
    }

    await getToken();
    await getTrack();

    let player = new Spotify.Player({
        name: 'A Spotify Web SDK Player',
        getOAuthToken: callback => {
            callback(token);
        },
        volume: 0.1
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        const play = ({
                          spotify_uri,
                          playerInstance: {
                              _options: {
                                  getOAuthToken,
                                  id
                              }
                          }
                      }) => {
            getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [spotify_uri] }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                });
            });
        };

        play({
            playerInstance: player,
            spotify_uri: track,
        });
    });
    player.connect();
};
