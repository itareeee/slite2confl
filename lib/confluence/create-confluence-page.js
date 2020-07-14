const fetch = require('node-fetch');
const short = require('short-uuid');

async function doCreate(title, body, parentPageId, retryOnDuplicateError, { token, email, origin, spaceKey }) {
  const basicAuth = Buffer.from(`${email}:${token}`).toString('base64');

  const res = await fetch(`${origin}/wiki/rest/api/content`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'page',
      title: title,
      space: { key: spaceKey },
      body: {
        storage: { value: body, representation: "storage" },
      },
      ancestors: [
        { id: parentPageId }
      ],
      metadata: {
        properties: { editor: { value: "v2" } },
      },
    }),
  });

  if (res.status === 200) {
    const json = await res.json();
    return json.id;
  } else {
    const resBody = await res.text();

    if (res.status === 400 && resBody.indexOf('this title already exists') >= 0 && retryOnDuplicateError) {
      const uuid = short.generate();
      const retryTitle = `${title} ${uuid}`;
      console.log(`Title duplicate error! Retring with a title: "${retryTitle}"`);
      return doCreate(retryTitle, body, parentPageId, false, { token, email, origin, spaceKey});
    } else {
      console.error(`HTTP Status: ${res.status}`, resBody);
      return null;
    }
  }
}

exports.createConfluencePage = doCreate;
