const fetch = require('node-fetch');
const markdown = require('markdown-it')({ xhtmlOut: true });


exports.fetchSliteNoteContent = async function(publicShareToken, title, sliteCxt) {
    const { origin, token } = sliteCxt;
    const mdUrl = `${origin}/api/s/note/${publicShareToken}/markdown.md?apiToken=${token}`;
    const res = await fetch(mdUrl);
    let txt = await res.text();

    // the first two lines are:
    // 1| "# title"
    // 2| "<empty line>"
    const redundantLeadingLines = RegExp(`^#\\s${title}\\n\\n`);
    if (redundantLeadingLines.test(txt)) {
        txt = txt.replace(redundantLeadingLines, '');
    }
    const xhtml = markdown.render(txt);
    return xhtml.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''); // remove control-characters as they are denied by Confluence API
};
