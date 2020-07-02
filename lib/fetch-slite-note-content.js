const fetch = require('node-fetch');
const markdown = require('markdown-it')({ xhtmlOut: true });

exports.fetchSliteNoteContent = async function(sliteOrigin, sliteJwt, publicShareToken) {
    const mdUrl = `${sliteOrigin}/api/s/note/${publicShareToken}/markdown.md?apiToken=${sliteJwt}`;
    const res = await fetch(mdUrl);
    const txt = await res.text();
    return markdown.render(txt);
};
