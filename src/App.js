import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      weatherData: null,
      unit: 'metric',
      favorites: [],
    };
  }

  componentDidMount() {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    this.setState({ favorites: savedFavorites });
  }

  fetchWeather = async () => {
    const { city, unit } = this.state;
    if (!city) return;

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=4c45ba12f7274f3fa09183742241012&q=${city}&units=${unit}`
      );
      this.setState({ weatherData: response.data });
    } catch (error) {
      alert('City not found check the name again.');
    }
  };

  toggleUnit = () => {
    this.setState((prevState) => ({
      unit: prevState.unit === 'metric' ? 'imperial' : 'metric',
    }));
  };

  addFavorite = () => {
    const { city, favorites } = this.state;
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      this.setState({ favorites: updatedFavorites });
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  loadFavorite = (favoriteCity) => {
    this.setState({ city: favoriteCity }, this.fetchWeather);
  };

  handleInputChange = (event) => {
    this.setState({ city: event.target.value });
  };

  render() {
    const { city, weatherData, unit, favorites } = this.state;

    return (
      <div className="weather-dashboard">
        <h1>Weather Dashboard</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={this.handleInputChange}
          />
          <button onClick={this.fetchWeather}>Search</button>
          <button onClick={this.toggleUnit}>
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>

        <div className="favorites">
          <h3>Favorite Cities:</h3>
          {favorites.length === 0 ? (
            <p>No favorite cities yet.</p>
          ) : (
            <ul>
              {favorites.map((fav, index) => (
                <li key={index} onClick={() => this.loadFavorite(fav)}>
                  {fav}
                </li>
              ))}
            </ul>
          )}
        </div>

        {weatherData && (
          <div className="weather-card">
            <h2>Current Weather in {weatherData.location.name}</h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind Speed: {weatherData.current.wind_kph} kmph</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <button onClick={this.addFavorite}>Save to Favorites</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
