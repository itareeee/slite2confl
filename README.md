# slite2confl

A tool for migration from Slite to Confluence Cloud.

### Basic Usage

```
$ npx @itareeee/slite2confl https://your.slite.com/app/channels/some-channel https://your.atlassian.net/wiki/spaces/some-space/pages/some-page/some-page-title
```

- Required options
  - `--slite-token` (default: environment variable `SLITE_TOKEN`)
    - Go to {your}.slite.com, open DevTool, and Run `copy(JSON.parse(localStorage.TOKENS).apiToken)` on console
  - `--confluence-token` (default: environment variable `CONFLUENCE_TOKEN`)
    - See: https://id.atlassian.com/manage-profile/security/api-tokens
  - `--confluence-email` (default: environment variable `CONFLUENCE_EMAIL`)
- Arbitrary Options:
  - `-r, --recursive`
  - `-d, --dry-run`
