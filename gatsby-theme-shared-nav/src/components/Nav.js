import * as React from 'react';

import {
  container,
  link,
  sharedNav,
} from '../styles/nav.module.css';
import {
  graphql,
  Link,
  useStaticQuery,
} from 'gatsby';


function Nav() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          navItems {
            label
            path
          }
        }
      }
    }
  `);

  const navItems = data.site.siteMetadata.navItems;

  return (
    <header className={container}>
      <Link to={'/'} className={link}>
        {data.site.siteMetadata.title}
      </Link>

      <nav className={sharedNav}>
        {navItems.map(navItem => (
            <Link key={`nav-${navItem.path}`} to={navItem.path} className={link}>
              {navItem.label}
            </Link>
          ),
        )
        }
      </nav>

    </header>
  );
}

export default Nav;
