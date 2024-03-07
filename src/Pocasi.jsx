import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const apiKey = "2a14fafe65a8afa1f2f57bbfec5fab19";
    const cities = [
        { name: "Louny", lat: 50.3553, lon: 13.7966 },
        { name: "Žatec", lat: 50.3266, lon: 13.5498 },
        { name: "Most", lat: 50.5039, lon: 13.6366 },
        { name: "Praha", lat: 50.0755, lon: 14.4378 },
        { name: "Chomutov", lat: 50.4608, lon: 13.4179 }
    ];
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const dataPromises = cities.map(city =>
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`)
                    .then(response => response.json())
            );

            const fetchedData = await Promise.all(dataPromises);
            setWeatherData(fetchedData);
        };

        fetchWeatherData();
    }, []);

    const filterDailyForecast = (dataList) => {
        const dailyForecast = [];
        const processedDates = {};

        dataList.forEach(data => {
            const date = new Date(data.dt * 1000).toLocaleDateString();
            if (!processedDates[date]) {
                dailyForecast.push(data);
                processedDates[date] = true;
            }
        });

        return dailyForecast;
    };

    return (
        <div className="container">
            <h1>Počasí</h1>
            {weatherData.map((cityData, index) => (
                <div className="city" key={index}>
                    <h2>{cities[index].name}</h2>
                    <div className="weather-info-container">
                        {filterDailyForecast(cityData.list).map((data, i) => (
                            <div className="weather-info" key={i}>
                                <p>Datum: {new Date(data.dt * 1000).toLocaleDateString()}</p>
                                <p>Teplota: {data.main.temp} °C</p>
                                <p>Počasí: {data.weather[0].description}</p>
                                <p>Počet srážek: {data.rain ? data.rain["3h"] : 0} mm</p>
                                <p>Vlhkost: {data.main.humidity}%</p>
                                <p>Rychlost větru: {data.wind.speed} m/s</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default App;
