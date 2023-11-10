import * as React from 'react';

import '../styles/variables.css';
import '../styles/global.css';
import {
  content,
  footer,
} from '../styles/layout.module.css';
import Nav from './Nav';

function Layout({ children }) {
  return (
    <>
      <Nav />
      <main className={content}>
        {children}
      </main>

      <footer className={footer}>
        Build with Shared Gatsby NAV

      </footer>
    </>
  );
}

export default Layout;
