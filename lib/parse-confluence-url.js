const { URL } = require('url');

// e.g. https://your.atlassian.net/wiki/spaces/some-space/pages/some-page/some-page-title
exports.parseConfluenceUrl = function(inputUrl) {
    const { host, origin, pathname } = new URL(inputUrl);
    const fragments = pathname.split('/').filter(_ => _ != '');

    if (!host.endsWith('.atlassian.net')) {
        throw new Error('Invalid Confluence URL');
    }

    if (fragments.length === 6 && fragments[0] === 'wiki' && fragments[1] === 'spaces' && fragments[3] == 'pages') {
        return {
            origin,
            spaceKey: fragments[2],
            pageId: fragments[4],
        };

    } else {
        throw new Error('Invalid Confluence URL');
    }
};
