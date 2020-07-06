# slite2confl

A tool for migration from Slite to Confluence Cloud.

### Setup

```
$ git clone https://github.com/itareeee/slite-to-confluence
$ cd slite-to-confluence

$ npm install

# Go to {your}.slite.com, open DevTool, and Run the following command on console:
# `copy(JSON.parse(localStorage.TOKENS).apiToken)`
$ export SLITE_JWT=xxxx


$ export CONFLUENCE_TOKEN=xxxx # see: https://id.atlassian.com/manage-profile/security/api-tokens
$ export CONFLUENCE_EMAIL=xxxx
```

### Dry-Run
```
$ node index.js --dry-run --recursive\
  --from https://your.slite.com/app/channels/some-channel\
  --to https://your.atlassian.net/wiki/spaces/some-space/pages/some-page/some-page-title

The following Slite notes will be migrated under https://bizreach.atlassian.net/wiki/spaces/~795038867/pages/1260519717/itaree+test
noteId: 111, noteTitle: Awesome Note 1
noteId: 222, noteTitle: Awesome Note 2
noteId: 333, noteTitle: Awesome Note 3
...
```


### Run

```
$ node index.js --dry-run --recursive\
  --from https://your.slite.com/app/channels/some-channel\
  --to https://your.atlassian.net/wiki/spaces/some-space/pages/some-page/some-page-title
  
Migrating note (noteId: 111, noteTitle: Awesome Note1) ...
Success (pageId: one)

Migrating note (noteId: 222, noteTitle: Awesome Note2) ...
Success (pageId: two)

Migrating note (noteId: 333, noteTitle: Awesome Note3) ...
Success (pageId: three)
```

