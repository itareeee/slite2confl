const { URL } = require('url');

exports.parseSliteUrl = function(inputUrl) {
    const { host, origin, pathname } = new URL(inputUrl);
    const fragments = pathname.split('/').filter(_ => _ != '');

    if (!host.endsWith('.slite.com')) {
        throw new Error('Invalid Slite URL');
    }


    // e.g. https://your.slite.com/app/channels/some-channel
    if (fragments.length === 3 && fragments[0] === 'app' && fragments[1] === 'channels') {
        return {
            channelId: fragments[2],
            noteId: null,
            origin,
        };

      // e.g. https://your.slite.com/app/channels/some-channel/notes/some-note
    } else if (fragments.length === 5 && fragments[0] === 'app' && fragments[1] === 'channels') {
        return {
            channelId: null,
            noteId: fragments[4],
            origin,
        };

    } else {
        throw new Error('Invalid Slite URL');
    }
};
