import { useState } from "react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    setError(""); // Reset error message
    const openWeatherApiKey = "81d4b30a4754460496f8620b1c3988f5"; // Replace with your OpenWeatherMap API key

    try {
      // Step 1: Get coordinates for the city using OpenCage API
      const geocodeResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${openWeatherApiKey}`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeResponse.ok || geocodeData.results.length === 0) {
        setError("City not found. Please try again.");
        return;
      }

      const { lat, lng } = geocodeData.results[0].geometry;

      // Step 2: Use the coordinates to fetch weather data from OpenWeatherMap API
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok || !weatherData.current_weather) {
        setError("Failed to fetch weather data. Please try again.");
        return;
      }

      const { temperature, weathercode } = weatherData.current_weather;
      let description = "Unable to fetch weather description";
      let temperatureMessage = "";

      // Step 3: Map weather code to description
      if (weathercode === 0) {
        description = "Clear sky";
      } else if (weathercode === 1) {
        description = "Partly cloudy";
      } else if (weathercode === 2) {
        description = "Cloudy";
      } else if (weathercode === 3) {
        description = "Overcast";
      } else {
        description = "Unknown weather";
      }

      // Step 4: Determine message based on temperature
      if (temperature < 10) {
        temperatureMessage = "It's quite cold outside. Wear warm clothes!";
      } else if (temperature >= 10 && temperature < 20) {
        temperatureMessage = "The weather is cool. A light jacket would be perfect.";
      } else if (temperature >= 20 && temperature < 30) {
        temperatureMessage = "The weather is mild. A comfortable outfit is recommended.";
      } else {
        temperatureMessage = "It's quite hot outside. Stay cool and hydrated!";
      }

      setWeather({
        city: city,
        temperature,
        description,
        temperatureMessage,
      });
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Simple Weather App
        </h1>

        {/* Input */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="border border-gray-300 p-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Weather Details */}
        {weather && (
          <div className="text-center bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {weather.city}
            </h2>
            <p className="text-xl text-gray-700">{weather.temperature}°C</p>
            <p className="text-lg text-gray-600">{weather.description}</p>
            <p className="text-md text-gray-500 mt-4">{weather.temperatureMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
