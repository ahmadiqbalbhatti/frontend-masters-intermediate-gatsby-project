import React from 'react';
import { graphql } from 'gatsby';
import {
  heading,
  listing,
} from '../styles/book.module.css';
import {
  GatsbyImage,
  getImage,
} from 'gatsby-plugin-image';
import Link from 'gatsby-link';

const Book = ({ data }) => {
  const book = data.book;

  return (
    <>
      <div className={listing}>
        <GatsbyImage alt={book.name} image={getImage(book.cover)} />
        <div>
          <h1 className={heading}>{book.name}</h1>
          <p>
            Author: <Link to={`/${book.author.slug}`}>
            {book.name}
          </Link>
          </p>
          {book.series && (
            <p>
              This is book {book.seriesOrder} of the {book.series}
            </p>
          )}
        </div>
      </div>
      <Link to={'/books'}>&larr; Back to All Books</Link>

    </>
  );
};

export const query = graphql`
  query GetABook($id: String) {
    book(id: {eq: $id}) {
      name
      author {
        name
        slug
      }
      series
      seriesOrder
      cover {
        childImageSharp {
          gatsbyImageData(width: 150)
        }
      }
    }
  }
`;

export default Book;
