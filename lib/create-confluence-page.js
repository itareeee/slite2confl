const fetch = require('node-fetch');

const confluence_token = process.env['CONFLUENCE_API_TOKEN'];
const confluence_email = process.env['CONFLUENCE_EMAIL'];


exports.createConfluencePage = async function(title, body, parentPageId, { token, email, origin, spaceKey }) {
  const basicAuth = Buffer.from(`${email}:${token}`).toString('base64');

  const res = await fetch(`${origin}/wiki/rest/api/content`, {
    method: 'POST',
    headers: { 
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "type": 'page',
      "title": title,
      "space": { "key": spaceKey },
      "body": {
        "storage": { "value": body, "representation": "storage" },
      },
      "ancestors": [
        { "id": parentPageId }
      ],
    }),
  });

  if (res.status == 200) {
    const json = await res.json();
    return json.id;
  } else {
    const body = await res.text();
    console.error(`HTTP Status: ${res.status}`, body);
    return null;
  }
}
