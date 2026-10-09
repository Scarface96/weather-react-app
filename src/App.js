import React, { useCallback, useEffect, useState } from 'react';
import { fetchForecast, reverseGeocode } from './api';
import { describe } from './weather';
import SearchBar from './components/SearchBar';
import { Current, Hourly, Daily } from './components/Forecast';

const STORE = { recents: 'weather-recents', unit: 'weather-unit', last: 'weather-last' };
const REFRESH_MS = 15 * 60 * 1000;

const QUICK_PICKS = [
  { name: 'Johannesburg', region: 'Gauteng', country: 'South Africa', lat: -26.2041, lon: 28.0473 },
  { name: 'Cape Town', region: 'Western Cape', country: 'South Africa', lat: -33.9249, lon: 18.4241 },
  { name: 'London', region: 'England', country: 'United Kingdom', lat: 51.5072, lon: -0.1276 },
  { name: 'New York', region: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable – the app still works without it */
  }
}

const samePlace = (a, b) => Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

function App() {
  const [place, setPlace] = useState(() => load(STORE.last, null));
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState('');
  const [unit, setUnit] = useState(() => load(STORE.unit, 'C'));
  const [recents, setRecents] = useState(() => load(STORE.recents, []));
  const [locating, setLocating] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => save(STORE.unit, unit), [unit]);
  useEffect(() => save(STORE.recents, recents), [recents]);

  const load_ = useCallback(async (p, { quiet = false } = {}) => {
    if (!quiet) setStatus('loading');
    setError('');
    try {
      const forecast = await fetchForecast(p.lat, p.lon);
      setData(forecast);
      setStatus('ready');
      setUpdatedAt(new Date());
    } catch {
      setStatus('error');
      setError(`Couldn't load the weather for ${p.name}. Check your connection, then try again.`);
    }
  }, []);

  // Fetch whenever the place changes, and refresh quietly every 15 minutes.
  useEffect(() => {
    if (!place) return undefined;
    save(STORE.last, place);
    load_(place);
    const timer = setInterval(() => load_(place, { quiet: true }), REFRESH_MS);
    return () => clearInterval(timer);
  }, [place, load_]);

  const selectPlace = (p) => {
    const clean = { name: p.name, region: p.region || '', country: p.country || '', lat: p.lat, lon: p.lon };
    setPlace(clean);
    setRecents((r) => [clean, ...r.filter((x) => !samePlace(x, clean))].slice(0, 6));
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError('Your browser doesn’t share location. Search for your city instead.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const named = await reverseGeocode(coords.latitude, coords.longitude);
        setLocating(false);
        selectPlace({ ...named, lat: coords.latitude, lon: coords.longitude });
      },
      () => {
        setLocating(false);
        setError('Location access was blocked. Allow it in your browser settings, or search for your city.');
      },
      { timeout: 10000 }
    );
  };

  // The page background follows the real sky in the chosen city.
  const sky = data ? describe(data.current.weather_code, data.current.is_day === 1).sky : 'clear-day';
  useEffect(() => {
    document.body.className = `sky-${sky}`;
  }, [sky]);

  const chips = recents.length ? recents : QUICK_PICKS;

  return (
    <div className="app">
      <header className="toolbar">
        <SearchBar onSelect={selectPlace} onLocate={locate} locating={locating} />
        <div className="unit-switch" role="radiogroup" aria-label="Temperature unit">
          {['C', 'F'].map((u) => (
            <button key={u} type="button" role="radio" aria-checked={unit === u} onClick={() => setUnit(u)}>
              °{u}
            </button>
          ))}
        </div>
      </header>

      <nav className="chips" aria-label={recents.length ? 'Recent places' : 'Suggested places'}>
        <span>{recents.length ? 'Recent' : 'Try'}</span>
        {chips.map((c) => (
          <button
            key={`${c.lat},${c.lon}`}
            type="button"
            className={place && samePlace(place, c) ? 'chip current-chip' : 'chip'}
            onClick={() => selectPlace(c)}
          >
            {c.name}
          </button>
        ))}
        {recents.length > 0 && (
          <button type="button" className="chip-clear" onClick={() => setRecents([])}>
            Clear
          </button>
        )}
      </nav>

      {error && (
        <div className="notice" role="alert">
          <p>{error}</p>
          {status === 'error' && place && (
            <button type="button" onClick={() => load_(place)}>
              Try again
            </button>
          )}
        </div>
      )}

      {!place && !error && (
        <section className="empty">
          <h1>What's the sky doing?</h1>
          <p>Search for any city, use your location, or pick one of the places above.</p>
        </section>
      )}

      {status === 'loading' && !data && <p className="loading">Loading the forecast…</p>}

      {data && place && (
        <main className={status === 'loading' ? 'forecast is-loading' : 'forecast'}>
          <Current place={place} data={data} unit={unit} />
          <Hourly data={data} unit={unit} />
          <Daily data={data} unit={unit} />
          <footer>
            {updatedAt && (
              <span>
                Updated {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.{' '}
                <button type="button" className="link" onClick={() => load_(place)}>
                  Refresh
                </button>
              </span>
            )}
            <span>
              Weather data by <a href="https://open-meteo.com/">Open-Meteo</a>
            </span>
          </footer>
        </main>
      )}
    </div>
  );
}

export default App;
