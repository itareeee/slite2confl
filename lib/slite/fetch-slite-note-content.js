const fetch = require('node-fetch');
const markdown = require('markdown-it')({ xhtmlOut: true });

exports.fetchSliteNoteContent = async function(publicShareToken, sliteCxt) {
    const { origin, token } = sliteCxt;
    const mdUrl = `${origin}/api/s/note/${publicShareToken}/markdown.md?apiToken=${token}`;
    const res = await fetch(mdUrl);
    const txt = await res.text();
    return markdown.render(txt);
};
