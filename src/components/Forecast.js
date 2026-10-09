import React from 'react';
import {
  describe,
  infoIcon,
  formatTemp,
  formatWind,
  compass,
  clock,
  uvLabel,
  dayName,
  upcomingHours,
} from '../weather';

function Detail({ icon, label, value, note }) {
  return (
    <div className="detail">
      {icon && <img src={infoIcon(icon)} alt="" />}
      <div>
        <span>{label}</span>
        <b>{value}</b>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}

export function Current({ place, data, unit }) {
  const c = data.current;
  const today = data.daily;
  const cond = describe(c.weather_code, c.is_day === 1);
  const where = [place.region, place.country].filter(Boolean).join(', ');

  return (
    <section className="current">
      <div className="current-head">
        <div>
          <h1>{place.name}</h1>
          {where && <p className="where">{where}</p>}
          <p className="local-time">Local time {clock(c.time)}</p>
        </div>
        <img className="current-icon" src={cond.icon} alt="" />
      </div>
      <div className="temp-row">
        <span className="temp">{formatTemp(c.temperature_2m, unit)}</span>
        <div className="temp-side">
          <b>{cond.label}</b>
          <span>Feels like {formatTemp(c.apparent_temperature, unit)}</span>
          <span>
            High {formatTemp(today.temperature_2m_max[0], unit)}, low {formatTemp(today.temperature_2m_min[0], unit)}
          </span>
        </div>
      </div>
      <div className="details">
        <Detail icon="humidity" label="Humidity" value={`${c.relative_humidity_2m}%`} />
        <Detail
          icon="wind"
          label="Wind"
          value={formatWind(c.wind_speed_10m, unit)}
          note={`from the ${compass(c.wind_direction_10m)}`}
        />
        <Detail icon="pressure" label="Pressure" value={`${Math.round(c.pressure_msl)} hPa`} />
        <Detail icon="sunny" label="UV index" value={Math.round(today.uv_index_max[0])} note={uvLabel(today.uv_index_max[0])} />
        <Detail icon="temp" label="Sunrise" value={clock(today.sunrise[0])} />
        <Detail icon="temp" label="Sunset" value={clock(today.sunset[0])} />
      </div>
    </section>
  );
}

export function Hourly({ data, unit }) {
  const hours = upcomingHours(data);
  return (
    <section className="card">
      <h2>Next 24 hours</h2>
      <ol className="hours">
        {hours.map((h, i) => {
          const cond = describe(h.code, h.isDay);
          return (
            <li key={h.time}>
              <span className="hour">{i === 0 ? 'Now' : clock(h.time)}</span>
              <img src={cond.icon} alt={cond.label} title={cond.label} />
              <b>{formatTemp(h.temp, unit)}</b>
              <span className={`rain ${h.rain >= 30 ? 'likely' : ''}`}>{h.rain}%</span>
            </li>
          );
        })}
      </ol>
      <p className="legend">Percentages show the chance of rain.</p>
    </section>
  );
}

export function Daily({ data, unit }) {
  const d = data.daily;
  const weekMin = Math.min(...d.temperature_2m_min);
  const weekMax = Math.max(...d.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  return (
    <section className="card">
      <h2>7-day forecast</h2>
      <ol className="days">
        {d.time.map((date, i) => {
          const cond = describe(d.weather_code[i], true);
          const lo = d.temperature_2m_min[i];
          const hi = d.temperature_2m_max[i];
          return (
            <li key={date}>
              <span className="day">{dayName(date, i)}</span>
              <img src={cond.icon} alt={cond.label} title={cond.label} />
              <span className="rain">{d.precipitation_probability_max[i] ?? 0}%</span>
              <span className="lo">{formatTemp(lo, unit)}</span>
              <span className="range" aria-hidden="true">
                <span style={{ left: `${((lo - weekMin) / span) * 100}%`, right: `${((weekMax - hi) / span) * 100}%` }} />
              </span>
              <span className="hi">{formatTemp(hi, unit)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
