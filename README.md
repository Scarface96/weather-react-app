# 🌦️ Weather React App

A React weather app that shows the current weather for any city with an hourly and 7-day forecast, powered by the free, keyless **Open-Meteo API**. The background sky changes to match the real conditions and time of day in the city you pick.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/Open--Meteo_API-2E7BCF?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

<p align="center">
  <img src="docs/images/search.png" alt="City search screen" width="40%">
  &nbsp;
  <img src="docs/images/result.png" alt="Forecast for Pretoria" width="40%">
</p>
<p align="center"><sub>City search with suggestions, and the forecast for Pretoria</sub></p>

## 🌐 Live Demo

**[scarface96.github.io/weather-react-app](https://scarface96.github.io/weather-react-app/)** — rebuilt and redeployed automatically on every push to `main`.

## ✨ Features

- 🔎 **City search with live suggestions** (debounced, keyboard friendly: ↑ ↓ Enter Esc)
- 📍 **Use my location** via the browser's geolocation
- 🌡️ Current temperature, **feels-like**, high/low, humidity, wind speed and direction, pressure, **UV index**, sunrise and sunset in the city's local time
- ⏱️ **Next 24 hours** with chance of rain
- 📅 **7-day forecast** with temperature range bars scaled across the week
- 🌄 **Living background**: clear, cloudy, rain, storm, fog and snow skies, by day and by night
- 🔁 **°C / °F** switch (wind switches between km/h and mph)
- 🕘 **Recent places** remembered in your browser, plus quick picks for first-time visitors
- ♻️ Auto-refresh every 15 minutes, with clear error messages and a retry button
- No API key needed, so the live demo never breaks because a key expired

## 🛠️ Built With

- **React 18** (hooks: `useState`, `useEffect`, `useCallback`, `useRef`)
- **Open-Meteo** forecast and geocoding APIs (free, no key) and BigDataCloud reverse geocoding
- Native `fetch` with `AbortController` to cancel stale searches
- Plain CSS with custom properties for the sky themes
- **Jest** unit tests (`src/weather.test.js`)
- **GitHub Actions** → GitHub Pages (`.github/workflows/deploy.yml`)

## 📁 Project Structure

```
src/
├── App.js                   # State, data loading, recent places, sky theme
├── api.js                   # Open-Meteo + reverse geocoding calls
├── weather.js               # Weather codes, units and formatting helpers
├── weather.test.js          # Unit tests for weather.js
├── components/
│   ├── SearchBar.js         # Search box with suggestions and "use my location"
│   └── Forecast.js          # Current conditions, 24-hour strip, 7-day list
└── index.css                # Styles and sky themes
public/icons/                # Weather and info icons (SVG)
```

## 🚀 Getting Started

```bash
git clone https://github.com/Scarface96/weather-react-app.git
cd weather-react-app
npm install
npm start
```

No API key or `.env` file is needed.

## 📚 What I Learned

Fetching data from third-party APIs, debouncing and cancelling requests, keyboard-accessible autocomplete, theming with CSS custom properties, and deploying with GitHub Actions.

---

👤 **Tony Mulunda** — [GitHub @Scarface96](https://github.com/Scarface96)

## About This Project

A React application that consumes live weather data from Open-Meteo and turns API responses into an easy-to-read interface. It demonstrates REST API integration, asynchronous requests, React component design, conditional rendering and reusable UI styling.
