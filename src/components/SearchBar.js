import React, { useEffect, useRef, useState } from 'react';
import { searchCities } from '../api';

function SearchBar({ onSelect, onLocate, locating }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState('');
  const boxRef = useRef(null);

  // Debounced city lookup; the AbortController drops stale responses.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setMessage('');
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const found = await searchCities(q, controller.signal);
        setResults(found);
        setActive(found.length ? 0 : -1);
        setMessage(found.length ? '' : `No place called "${q}". Check the spelling or try a nearby city.`);
        setOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMessage('Search is unavailable right now. Check your connection and try again.');
          setOpen(true);
        }
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close the list when clicking elsewhere.
  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const choose = (place) => {
    onSelect(place);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="search" ref={boxRef}>
      <div className="search-row">
        <input
          type="search"
          value={query}
          placeholder="Search for a city"
          aria-label="Search for a city"
          aria-expanded={open}
          aria-controls="city-results"
          aria-autocomplete="list"
          role="combobox"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (results.length || message) && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="locate" onClick={onLocate} disabled={locating} title="Use my location">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.94 3A9 9 0 0 0 13 3.06V1h-2v2.06A9 9 0 0 0 3.06 11H1v2h2.06A9 9 0 0 0 11 20.94V23h2v-2.06A9 9 0 0 0 20.94 13H23v-2h-2.06ZM12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
            />
          </svg>
          <span className="sr-only">Use my location</span>
        </button>
      </div>
      {open && (results.length > 0 || message) && (
        <ul className="results" id="city-results" role="listbox">
          {results.map((r, i) => (
            <li
              key={r.id}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(r);
              }}
            >
              <b>{r.name}</b>
              <span>{[r.region, r.country].filter(Boolean).join(', ')}</span>
            </li>
          ))}
          {message && <li className="message">{message}</li>}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
