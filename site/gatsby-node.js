// const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

const authors = require('./src/data/authors.json');
const books   = require('./src/data/books.json');
const slugify = require('slugify');

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode, createTypes } = actions;

  // Creating relationship of author node and book node
  createTypes(`
    type Author implements Node{
      books: [Book!]! @link(from: "slug" by: "author.slug")
    }
    
    
    type Book implements Node{
      author: Author! @link(from: "author" by: "slug")
    }
  `);


  // Creating a Node of AUTHOR
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

  // Creating a Node of BOOK
  books.forEach((book) => {
    createNode({
      ...book,
      id      : createNodeId(`book-${book.isbn}`),
      parent  : null,
      children: [],
      internal: {
        type         : 'Book',
        content      : JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });

  // const node = {
  //   id      : createNodeId(`some-unique-string`),
  //   parent  : null,
  //   children: [],
  //   internal: {
  //     type         : 'MyCustomType',
  //     content      : JSON.stringify(nodeContent),
  //     contentDigest: createContentDigest(nodeContent),
  //   },
  // };

};

exports.createPages = async ({ actions, graphql }) => {


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

  const result = await graphql(`
    query GetBooks {
      allBook {
        nodes {
          id
          name
          series
        }
      }
    }
  `);

  const books = result.data.allBook.nodes;

  books.forEach((book) => {
    const bookSlug = slugify(book.name, { lower: true });

    if (book.series === null) {
      createPage({
        path     : `/book/${bookSlug}`,
        component: require.resolve('./src/templates/book.js'),
        context  : {
          id: book.id,
        },
      });
    } else {
      const seriesSlug = slugify(book.series, { lower: true });

      createPage({
        path     : `/book/${seriesSlug}/${bookSlug}`,
        component: require.resolve('./src/templates/book.js'),
        context  : {
          id: book.id,
        },
      });
    }
  });
};

exports.createResolvers = ({
                             actions,
                             cache,
                             createNodeId,
                             createResolvers,
                             store,
                             reporter,
                           }) => {
  const { createNode } = actions;

  const resolvers = {
    Book: {
      buyLink : {
        type   : 'String',
        resolve: (source) => `https://www.powells.com/searchresults?keyword=${source.isbn}`,
      }, cover: {
        type   : 'File',
        resolve: async (source) => {
          const response = await fetch(`https://openlibrary.org/isbn/${source?.isbn}.json`);

          if (!response.ok) {
            reporter.warn(`Error loading details about ${source.name} - got ${response.status} ${response.statusText}`);
            return null;
          }

          const { covers } = await response.json();

          if (covers.length) {
            return createRemoteFileNode({
              url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            });
          } else {
            return null;
          }
        },
      },
    },
  };

  createResolvers(resolvers);
};
