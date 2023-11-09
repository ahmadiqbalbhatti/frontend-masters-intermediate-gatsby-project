const authors = require('./src/data/authors.json');
const books   = require('./src/data/books.json');

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  authors.forEach((author) => {
    createNode({
      ...author,
      id      : createNodeId(`author-${author.slug}`),
      parent  : null,
      children: [],
      internal: {
        type         : 'Author',
        content      : JSON.stringify(author),
        contentDigest: createContentDigest(author),
      },
    });
  });
  const node = {
    id      : createNodeId(`some-unique-string`),
    parent  : null,
    children: [],
    internal: {
      type         : 'MyCustomType',
      content      : JSON.stringify(nodeContent),
      contentDigest: createContentDigest(nodeContent),
    },
  };

};

exports.createPages = ({ actions }) => {


  const { createPage } = actions;

  createPage({
    path     : '/custom',
    component: require.resolve('./src/templates/custom.js'),
    context  : {
      title: 'A custom page!', meta: {
        description: 'A custom page with page context',
      },
    },
  });
};
