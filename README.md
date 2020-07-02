### Setup

```
$ npm install

$ export SLITE_JWT=xxxx
$ export CONFLUENCE_TOKEN=xxxx
$ export CONFLUENCE_EMAIL=xxxx
```

### Dry-Run
```
$ node index.js --dry-run --recursive\
  --from https://your.slite.com/app/channels/some-channel\
  --to https://your.atlassian.net/wiki/spaces/some-space/pages/some-page/some-page-title

The following Slite notes are migrated under https://bizreach.atlassian.net/wiki/spaces/~795038867/pages/1260519717/itaree+test
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


### FAQ

- Q. How to find SLITE_JWT
  - Go to {your}.slite.com
  - Open DevTool
  - Run on Console: `copy(JSON.parse(localStorage.TOKENS).apiToken)`

- Q. How to find CONFULENCE_TOKEN
  - see: https://id.atlassian.com/manage-profile/security/api-tokens
  
