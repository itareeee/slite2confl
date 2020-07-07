# slite2confl

A tool for migration from Slite to Confluence Cloud.

### Basic Usage

```
$ npx itareeee/slite2confl [options] <slite-url> <confluence-url>
```

#### Arguments
- `slite-url`: Slite Channel URL or Note URL to migrate
  - e.g. https://${your}.slite.com/app/channels/{channelId}
  - e.g. https://${your}.slite.com/app/channels/{channelId}/notes/{noteId}
- `confluence-url`: Confluence Page URL under which the slite notes are migrated.
  - e.g. https://your.atlassian.net/wiki/spaces/${space-key}/pages/{pageId}/{pageTitle}

#### Required options
- `--slite-token` (default: environment variable `SLITE_TOKEN`)
  - Go to {your}.slite.com, open DevTool, and Run `copy(JSON.parse(localStorage.TOKENS).apiToken)` on console
- `--confluence-token` (default: environment variable `CONFLUENCE_TOKEN`)
  - See: https://id.atlassian.com/manage-profile/security/api-tokens
- `--confluence-email` (default: environment variable `CONFLUENCE_EMAIL`)

#### Arbitrary Options:
- `-r, --recursive`
- `-d, --dry-run`
