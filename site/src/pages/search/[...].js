import * as React from 'react';
import {
  useEffect,
  useState,
} from 'react';
import { navigate } from 'gatsby';

import {
  button,
  form,
  input,
} from '../../styles/search.module.css';
import fetch from 'node-fetch';

function SearchClientOnly({ params }) {
  const query = decodeURIComponent(params['*']);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('IDLE');


  function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const query = formData.get('search');

    setCurrentQuery(query);

    navigate(`/search/${encodeURIComponent(query)}`);

  }

  function handleSearchReset() {
    setCurrentQuery('');
    navigate('/search/');
  }

  async function bookSearch(query) {
    setStatus('LOADING');

    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const result = await response.json();

    setResult(result);
    setStatus('IDLE');

  }

  useEffect(() => {
    if (currentQuery === '') {
      setResult(null);
      return;
    }

    bookSearch(currentQuery);
  }, [currentQuery]);

  return (
    <>
      <h1>Search for a Book</h1>
      <form className={form} onSubmit={handleSearch}>
        <input type='search' name={'search'} className={input} />
        <button className={button}>Search</button>
        <button className={button} type={'reset'}
                onClick={handleSearchReset}>Reset
        </button>
      </form>

      {status === 'LOADING' && <p>Loading results</p>}
      {status === 'IDLE' && currentQuery !== '' ? (
        <>
          <h2>Search results for "{currentQuery}"</h2>
          <ul>
            {result && result.docs.map(doc => (
              <li key={doc.key}>
                <strong>{doc.title}</strong> `by {doc.author_name?.[0]}`
              </li>
            ))}
          </ul>
        </>
      ) : null

      }

    </>
  );
}

export default SearchClientOnly;
