import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=4c45ba12f7274f3fa09183742241012&q=${city}&units=${unit}`
      );
      setWeatherData(response.data);
    } catch (error) {
      alert('City not found. Please check the name again.');
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const addFavorite = () => {
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const loadFavorite = (favoriteCity) => {
    setCity(favoriteCity);
    fetchWeather();
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const isMetric = unit === 'metric';

  return (
    <div className="weather-dashboard">
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={fetchWeather}>Search</button>
        <button onClick={toggleUnit}>
          Switch to {isMetric ? 'Fahrenheit' : 'Celsius'}
        </button>
      </div>

      <div className="favorites">
        <h3>Favorite Cities:</h3>
        {favorites.length === 0 ? (
          <p>No favorite cities added.</p>
        ) : (
          <ul>
            {favorites.map((fav, index) => (
              <li key={index} onClick={() => loadFavorite(fav)}>
                {fav}
              </li>
            ))}
          </ul>
        )}
      </div>

      {weatherData && (
        <div className="weather-card">
          <h2>Current Weather in {weatherData.location.name}</h2>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>
            Temperature: {isMetric ? weatherData.current.temp_c : weatherData.current.temp_f}°
            {isMetric ? 'C' : 'F'}
          </p>
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind Speed: {weatherData.current.wind_kph} kmph</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <p>Time: {weatherData.location.localtime}</p>
          <button onClick={addFavorite}>Save to Favorites</button>
        </div>
      )}
    </div>
  );
};

export default App;
