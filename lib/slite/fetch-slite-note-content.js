const fetch = require('node-fetch');
const markdown = require('markdown-it')({ xhtmlOut: true });

exports.fetchSliteNoteContent = async function(publicShareToken, sliteCxt) {
    const { origin, token } = sliteCxt;
    const mdUrl = `${origin}/api/s/note/${publicShareToken}/markdown.md?apiToken=${token}`;
    const res = await fetch(mdUrl);
    const txt = await res.text();
    const xhtml = markdown.render(txt);
    return xhtml.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''); // remove control-characters as they are denied by Confluence API
};
