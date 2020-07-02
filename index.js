const { program } = require('commander');

const { parseSliteUrl } = require('./lib/parse-slite-url');
const { parseConfluenceUrl } = require('./lib/parse-confluence-url');
const { findNote, findNotesUnderChannel } = require('./lib/find-slite-note');
const { fetchSliteNoteContent } = require('./lib/fetch-slite-note-content');
const { createConfluencePage } = require('./lib/create-confluence-page');


const sliteJwt = process.env['SLITE_JWT'];
const confluenceToken = process.env['CONFLUENCE_API_TOKEN'];
const confluenceEmail = process.env['CONFLUENCE_EMAIL'];

if (!sliteJwt || !confluenceToken || !confluenceEmail) {
  throw new Error('Variables MUST be set: "SLITE_JWT", "CONFLUENCE_API_TOKEN", "CONFLUENCE_EMAIL"');
}


program
  .option('-f, --from <slite-url>', 'Slite channel URL or note URL')
  .option('-t, --to <confluence-url>', 'Confluence page url')
  .option('-d, --dry-run', 'dry-run')
  .option('-r, --recursive', 'Migrate pages recursively');
program.parse(process.argv);

const { channelId: rootChannelId, noteId: rootNoteId, origin: sliteOrigin } = parseSliteUrl(program.from);
const { spaceKey, pageId: rootPageId, origin: confluenceOrigin } = parseConfluenceUrl(program.to);
const dryRun = program.dryRun;
const recursive = program.recursive;


(async function() {
  const notes = await (
    rootChannelId != null
    ? findNotesUnderChannel(sliteOrigin, sliteJwt, rootChannelId, recursive)  
    : findNote(sliteOrigin, sliteJwt, rootNoteId, recursive)
  );

  if (dryRun) {
    console.log(`The following Slite notes are migrated under ${program.to}`);
    for (const note of notes) {
      console.log(`noteId: ${note.id}, noteTitle: ${note.title}`);
    }
    return;
  }

  const createdPages = {};

  for (const note of notes) {
    console.log(`\nMigrating note (noteId: ${note.id}, noteTitle: ${note.title}) ...`);

    const xhtml = await fetchSliteNoteContent(sliteOrigin, sliteJwt, note.publicShareToken);

    const parentPageId = note.parentNoteId ? createdPages[note.parentNoteId] : rootPageId;
    const pageId = await createConfluencePage(
      note.title, xhtml, parentPageId,
      { token: confluenceToken, email: confluenceEmail, origin: confluenceOrigin, spaceKey }
    );

    if (pageId) {
      console.log(`Success (pageId: ${pageId})`);
      createdPages[note.id] = pageId;
    } else {
      throw new Error(`Error: failed to migrate slite note (noteId: ${id}, noteTitle: ${title})`);
    }
  }
})();
