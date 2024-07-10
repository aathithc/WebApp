// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import Events from './pages/Events';
import Evaluations from './pages/Evaluations';

function App() {
    const [weather, setWeather] = useState('No weather data available');
    const [events, setEvents] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        console.log('App component rendered');
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchWeather();
        fetchAgenda();
    }, []);

    const fetchWeather = () => {
        axios.get('http://localhost:5001/api/weather')
            .then(response => {
                const weatherData = response.data;
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                setWeather(`Temperature: ${temp}°F, ${description}`);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    };

    const fetchAgenda = () => {
        axios.get('http://localhost:5000/api/agenda')
            .then(response => {
                const eventsData = response.data;
                setEvents(eventsData);
            })
            .catch(error => console.error('Error fetching agenda:', error));
    };

    return (
        <Router>
            <div className="container">
                <div className="header">
                    <div id="current-date-time">{`${currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${currentTime.toLocaleTimeString()}`}</div>
                    <div id="weather">{weather}</div>
                </div>
                <Routes>
                    <Route path="/" element={
                        <div className="main-content">
                            <Home />
                            <div className="sidebar">
                                <div id="agenda">
                                    <h3>Today's Agenda</h3>
                                    <div id="events-list">
                                        {events.length > 0 ? events.map((event, index) => (
                                            <div className="event" key={index}>
                                                <h4>{event.time}</h4>
                                                <p>{event.title}</p>
                                                <p>{event.participants}</p>
                                            </div>
                                        )) : <p>No events available</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    } />
                    <Route path="/events" element={<Events />} />
                    <Route path="/evaluations" element={<Evaluations />} />
                </Routes>
                <div className="navbar">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/events" className="nav-item">Events</Link>
                    <Link to="/evaluations" className="nav-item">Evaluations</Link>
                </div>
            </div>
        </Router>
    );
}

export default App;
