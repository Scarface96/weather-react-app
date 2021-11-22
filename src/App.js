import React, { useState } from "react";
import styled from 'styled-components';
import Axios from "axios";
import CityComponent from './models/CityComponent'
import WeatherComponent from './models/WeatherComponent'

const API_KEY = "bf41e8dbb5b69931c5af281c3f3642f8"


const Container = styled.div`
 display: flex;
 flex-direction: column;
 margin: auto;
 align-items: center;
 box-shadow: 0 3px 6px 0 #555;
 padding: 20px 10px;
 border-radius: 4px;
 width: 380px;
 background: white;
 font-family: Montserrat;
`;

const AppLabel = styled.span`
  color: black;
  margin: 20px auto;
  font-size: 18px;
  font-weight: bold;
`;




function App() {
  const [city, updateCity] = useState();
  const [weather, updateWeather] = useState();
  
  const fetchWeather = async (e) => {
    e.preventDefault();
    const response = await Axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`,
    );

    updateWeather(response.data);
  }

  return (
  <Container>
    <AppLabel>Live Weather</AppLabel>
    {weather ? (
      <WeatherComponent weather={weather} city={city}/>
    ) : (
      <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
    )}
    </Container>
  )     
}

export default App;
