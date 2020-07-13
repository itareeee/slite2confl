const { program } = require('commander');

const { parseCommand } = require('./lib/parse-command');
const { findNote, findNotesUnderChannel } = require('./lib/slite/find-slite-note');
const { fetchSliteNoteContent } = require('./lib/slite/fetch-slite-note-content');
const { createConfluencePage } = require('./lib/confluence/create-confluence-page');


(async function() {
  const { slite: sliteCxt, confluence: confluenceCxt, dryRun, recursive } = parseCommand();

  const notes = sliteCxt.channelId != null
    ? await findNotesUnderChannel(sliteCxt.origin, sliteCxt.token, sliteCxt.channelId, recursive)  
    : await findNote(sliteCxt.origin, sliteCxt.token, sliteCxt.noteId, recursive);

  if (dryRun) {
    console.log(`The following Slite notes are migrated under ${program.to}`);
    for (const note of notes) {
      console.log(`noteId: ${note.id}, noteTitle: ${note.title}`);
      await fetchSliteNoteContent(note.publicShareToken, note.title, sliteCxt);
    }
    return;
  }

  const createdPages = {};

  for (const note of notes) {
    console.log(`\nMigrating note (noteId: ${note.id}, noteTitle: ${note.title}) ...`);

    const xhtml = await fetchSliteNoteContent(note.publicShareToken, note.title, sliteCxt);

    const parentPageId = note.parentNoteId ? createdPages[note.parentNoteId] : confluenceCxt.pageId;
    const pageId = await createConfluencePage(note.title, xhtml, parentPageId, confluenceCxt);

    if (pageId) {
      console.log(`Successfully migrated (pageId: ${pageId})`);
      createdPages[note.id] = pageId;
    } else {
      throw new Error(`Failed to migrate slite note (noteId: ${note.id}, noteTitle: ${note.title})`);
    }
  }
})();
