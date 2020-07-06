const { GraphQLClient } = require('graphql-request'); 

const fragmentNoteAttrs = `
  fragment noteAttrs on Note {
    id
    __typename
    title
    publicShareToken
    channelId
    archivedAt
    hasChildren
    parentNote {
      id
      __typename
    }
  }
`;

const listChannelNotesQuery = `
  query listChannelNotes($channelId: ID!, $pagination: PaginationInput!) {
    showChannel(channelId: $channelId) {
      id
      name
      notes(pagination: $pagination, order: {field: listPosition, direction: DESC}) {
        totalCount
        edges {
          cursor
          node {
            ...noteAttrs
          }
          __typename
        }
        pageInfo {
          hasNextPage
          endCursor
          __typename
        }
        __typename
      }
      __typename
    }
  }

  ${fragmentNoteAttrs}
`;

const listNoteChildrenNotesQuery = `
  query listNoteChildrenNotes($noteId: ID!, $pagination: PaginationInput!) {
    showNote(noteId: $noteId) {
      id
      title
      publicShareToken
      notes(pagination: $pagination, order: {field: listPosition, direction: DESC}) {
        totalCount
        edges {
          cursor
          node {
            ...noteAttrs
            __typename
          }
          __typename
        }
        pageInfo {
          hasNextPage
          endCursor
          __typename
        }
        __typename
      }
      __typename
    }
  }

  ${fragmentNoteAttrs}
`;

exports.findNote = async function(origin, jwt, rootNoteId, recursive) {
  const gql = new GraphQLClient(`${origin}/api/graphql`, {
    headers: { 'Authorization': `JWT ${jwt}` }
  });

  const data = await gql.request(listNoteChildrenNotesQuery, {
     noteId: rootNoteId,
     pagination: { first: 100, after: null },
  });

  const childNotes = recursive 
    ? await Promise.all(data.showNote.notes.edges.map(async _ => {
        const { id, hasChildren, title, publicShareToken }  = _.node;
        const children = await (hasChildren ? listChildNotes(gql, id) : Promise.resolve([]));
        return { id, publicShareToken, title, children };
      }))
    : [];

  return flatten([
    {
      id: data.showNote.id,
      title: data.showNote.title,
      publicShareToken: data.showNote.publicShareToken,
      children: childNotes,
    }
  ]);
};

exports.findNotesUnderChannel = async function(origin, jwt, channelId, recursive) {
  const gql = new GraphQLClient(`${origin}/api/graphql`, {
    headers: { 'Authorization': `JWT ${jwt}` }
  });

  const data = await gql.request(listChannelNotesQuery, {
    channelId, 
    pagination: { first: 100, after: null },
  });

  const notes = await Promise.all(
    data.showChannel.notes.edges.map(async _ => {
      const { id, hasChildren, title, publicShareToken }  = _.node;
      const children = await (hasChildren ? listChildNotes(gql, id) : Promise.resolve([]));
      return { id, title, publicShareToken, children }; 
    })
  );

  return flatten(notes);
};


async function listChildNotes(gqlClient, parentNoteId) {
  const data = await gqlClient.request(listNoteChildrenNotesQuery, {
     noteId: parentNoteId,
     pagination: { first: 100, after: null },
  });

  return Promise.all(
    data.showNote.notes.edges.map(async _ => {
      const { id, hasChildren, title, publicShareToken }  = _.node;
      const children = await (hasChildren ? listChildNotes(gqlClient, id) : Promise.resolve([]));
      return { id, publicShareToken, title, children };
    })
  );
}

// convert tree structure to flat array
function flatten(notes) { 
  const res = [];
  const queue = [...notes.map(n => ({ ...n, parentNoteId: null }))];

  do {
    const n = queue.shift();
    const { id, title, publicShareToken, children, parentNoteId } = n;
    res.push({ id, title, publicShareToken, parentNoteId });

    if (children && children.length > 0) {
      queue.push(...children.map(c => ({ ...c, parentNoteId: id })));
    } 
  } while (queue.length > 0);
  
  return res;
}
