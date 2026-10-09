import { describe as describeCode, formatTemp, formatWind, compass, clock, uvLabel, upcomingHours } from './weather';

test('weather codes map to labels, icons and skies', () => {
  expect(describeCode(0, true)).toMatchObject({ label: 'Clear sky', sky: 'clear-day' });
  expect(describeCode(0, false).icon).toMatch(/night\.svg$/);
  expect(describeCode(95, true).sky).toBe('storm-day');
  expect(describeCode(12345, true).label).toBe('Overcast'); // unknown code falls back safely
});

test('temperature and wind units', () => {
  expect(formatTemp(20, 'C')).toBe('20°');
  expect(formatTemp(20, 'F')).toBe('68°');
  expect(formatTemp(null, 'C')).toBe('–');
  expect(formatWind(100, 'C')).toBe('100 km/h');
  expect(formatWind(100, 'F')).toBe('62 mph');
});

test('small formatters', () => {
  expect(compass(0)).toBe('N');
  expect(compass(225)).toBe('SW');
  expect(clock('2026-10-09T05:31')).toBe('05:31');
  expect(uvLabel(9)).toBe('Very high');
});

test('upcomingHours starts at the current hour', () => {
  const time = Array.from({ length: 48 }, (_, h) => `2026-10-0${9 + Math.floor(h / 24)}T${String(h % 24).padStart(2, '0')}:00`);
  const data = {
    current: { time: '2026-10-09T15:30' },
    hourly: {
      time,
      temperature_2m: time.map((_, i) => i),
      weather_code: time.map(() => 0),
      precipitation_probability: time.map(() => 10),
      is_day: time.map(() => 1),
    },
  };
  const hours = upcomingHours(data);
  expect(hours).toHaveLength(24);
  expect(hours[0]).toMatchObject({ time: '2026-10-09T15:00', temp: 15 });
});
