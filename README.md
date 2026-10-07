# 🌦️ Weather React App

A React weather app that shows the current weather for any city using the **OpenWeatherMap API**.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap_API-EB6E4B?style=flat-square)

<p align="center">
  <img src="docs/images/search.png" alt="City search screen" width="40%">
  &nbsp;
  <img src="docs/images/result.png" alt="Weather result for Cape Town" width="40%">
</p>
<p align="center"><sub>Search screen and the result for Cape Town</sub></p>

## ✨ Features

- 🔎 Search for any city
- 🌡️ Current **temperature** and weather **description**, with an icon for the conditions
- 📍 City and country
- 📊 Extra details: **sunrise / sunset**, **humidity**, **wind** and **pressure**, each with its own icon

## 🛠️ Built With

- **React** (hooks)
- **styled-components** for component-level styling
- **Axios** for API requests
- **OpenWeatherMap Current Weather API**
- **gh-pages** for deployment to GitHub Pages

## 📁 Project Structure

```
src/
├── App.js                       # App shell and API call
├── models/
│   ├── CityComponent.js         # City search form
│   └── WeatherComponent.js      # Weather results display
└── index.js
public/icons/                    # Weather and info icons (SVG)
```

## 🚀 Getting Started

```bash
git clone https://github.com/Scarface96/weather-react-app.git
cd weather-react-app
yarn install
yarn start
```

Get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and set it as `API_KEY` in `src/App.js`.

**Deploy to GitHub Pages:**
```bash
yarn deploy
```

## 📚 What I Learned

Fetching data from a third-party API, passing data between components, conditional rendering, and styling with styled-components.

---

👤 **Tony Mulunda** — [GitHub @Scarface96](https://github.com/Scarface96)
