// Turns Open-Meteo's WMO weather codes into words, icons and a sky colour.

const icon = (name) => `${process.env.PUBLIC_URL}/icons/${name}.svg`;

const CODES = {
  0: { label: 'Clear sky', day: 'sunny', night: 'night', sky: 'clear' },
  1: { label: 'Mostly clear', day: 'sunny', night: 'night', sky: 'clear' },
  2: { label: 'Partly cloudy', day: 'day', night: 'cloudy-night', sky: 'partly' },
  3: { label: 'Overcast', day: 'cloudy', night: 'cloudy-night', sky: 'cloudy' },
  45: { label: 'Fog', day: 'cloudy', night: 'cloudy-night', sky: 'fog' },
  48: { label: 'Freezing fog', day: 'cloudy', night: 'cloudy-night', sky: 'fog' },
  51: { label: 'Light drizzle', day: 'rain', night: 'rain-night', sky: 'rain' },
  53: { label: 'Drizzle', day: 'rain', night: 'rain-night', sky: 'rain' },
  55: { label: 'Heavy drizzle', day: 'rain', night: 'rain-night', sky: 'rain' },
  56: { label: 'Freezing drizzle', day: 'rain', night: 'rain-night', sky: 'rain' },
  57: { label: 'Freezing drizzle', day: 'rain', night: 'rain-night', sky: 'rain' },
  61: { label: 'Light rain', day: 'rain', night: 'rain-night', sky: 'rain' },
  63: { label: 'Rain', day: 'rain', night: 'rain-night', sky: 'rain' },
  65: { label: 'Heavy rain', day: 'rain', night: 'rain-night', sky: 'rain' },
  66: { label: 'Freezing rain', day: 'rain', night: 'rain-night', sky: 'rain' },
  67: { label: 'Freezing rain', day: 'rain', night: 'rain-night', sky: 'rain' },
  71: { label: 'Light snow', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  73: { label: 'Snow', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  75: { label: 'Heavy snow', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  77: { label: 'Snow grains', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  80: { label: 'Rain showers', day: 'rain', night: 'rain-night', sky: 'rain' },
  81: { label: 'Rain showers', day: 'rain', night: 'rain-night', sky: 'rain' },
  82: { label: 'Violent showers', day: 'storm', night: 'storm', sky: 'storm' },
  85: { label: 'Snow showers', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  86: { label: 'Snow showers', day: 'cloudy', night: 'cloudy-night', sky: 'snow' },
  95: { label: 'Thunderstorm', day: 'storm', night: 'storm', sky: 'storm' },
  96: { label: 'Thunderstorm with hail', day: 'storm', night: 'storm', sky: 'storm' },
  99: { label: 'Thunderstorm with hail', day: 'storm', night: 'storm', sky: 'storm' },
};

export function describe(code, isDay = true) {
  const c = CODES[code] || CODES[3];
  return { label: c.label, icon: icon(isDay ? c.day : c.night), sky: `${c.sky}-${isDay ? 'day' : 'night'}` };
}

export const infoIcon = icon;

export function formatTemp(celsius, unit) {
  if (celsius == null) return '–';
  const v = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(v)}°`;
}

export function formatWind(kmh, unit) {
  return unit === 'F' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`;
}

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const compass = (deg) => DIRS[Math.round(deg / 45) % 8];

/** "2026-10-09T05:31" -> "05:31" (Open-Meteo already returns the place's local time). */
export const clock = (iso) => iso.slice(11, 16);

export function uvLabel(uv) {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very high';
  return 'Extreme';
}

export function dayName(isoDate, index) {
  if (index === 0) return 'Today';
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en', { weekday: 'short' });
}

/** The next `count` hourly entries starting at the current hour. */
export function upcomingHours(data, count = 24) {
  const now = data.current.time.slice(0, 13); // "2026-10-09T15"
  const start = Math.max(0, data.hourly.time.findIndex((t) => t.slice(0, 13) >= now));
  return data.hourly.time.slice(start, start + count).map((t, i) => ({
    time: t,
    temp: data.hourly.temperature_2m[start + i],
    code: data.hourly.weather_code[start + i],
    rain: data.hourly.precipitation_probability[start + i],
    isDay: data.hourly.is_day[start + i] === 1,
  }));
}
