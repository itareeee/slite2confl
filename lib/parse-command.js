const { program } = require('commander');

const { parseSliteUrl } = require('./slite/parse-slite-url');
const { parseConfluenceUrl } = require('./confluence/parse-confluence-url');

exports.parseCommand = function() {
  program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false);

  let sliteUrl = null;
  let confluenceUrl = null;
  program
    .version('0.2.0')
    .arguments('<slite-url> <confluence-url>')
    .action((s, c) => { sliteUrl = s; confluenceUrl = c; })
    
  program
    .requiredOption(
      '--slite-token <slite-token>', 
      'Go to {your}.slite.com, open DevTool, and Run `JSON.parse(localStorage.TOKENS).apiToken` on console. You can also set the token by environment variable `SLITE_TOKEN` .', 
      process.env['SLITE_TOKEN']
    )
    .requiredOption(
      '--confluence-token <confluence-token>', 
      'Get API token on https://id.atlassian.com/manage-profile/security/api-tokens . You Can also set the token by environemtn variable `CONFLUENCE_TOKEN` .', 
      process.env['CONFLUENCE_TOKEN']
    )
    .requiredOption(
      '--confluence-email <confluence-email>', 
      'You Can also set the email by environemtn variable `CONFLUENCE_EMAIL` .', 
      process.env['CONFLUENCE_EMAIL'],
    )

  program
    .option('-d, --dry-run', 'dry-run')
    .option('-r, --recursive', 'Migrate pages recursively')
    .option('--bypass-duplicate-error', 'Retry confluence page creation with a random string appended to the page title upon title duplicate error');

  const options = program.parse(process.argv).opts();

  return { 
    slite: { 
      ...parseSliteUrl(sliteUrl), 
      token: options.sliteToken,
    }, 
    confluence: {
      ...parseConfluenceUrl(confluenceUrl), 
      token: options.confluenceToken, 
      email: options.confluenceEmail,
    },
    dryRun: options.dryRun, 
    recursive: options.recursive,
    bypassDuplicateError: options.bypassDuplicateError,
  };
};
