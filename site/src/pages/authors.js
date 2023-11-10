import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Link from 'gatsby-link';

const Authors = () => {
  const data = useStaticQuery(graphql`
    {
      allAuthor {
        nodes {
          name
          slug
        }
      }
    }
  `);

  const authors = data.allAuthor.nodes;
  return(
    <>
      <h1>Authors</h1>
      <ul>
        {
          authors.map((author)=>(
            <li>
              <Link to={`/${author.slug}`}>
                {author.name}
              </Link>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default Authors
