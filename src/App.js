import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Home() {
    useEffect(() => {
        console.log('Home component rendered');
    }, []);
    return <h1>Welcome to ETS Laboratories</h1>;
}

function Events() {
    useEffect(() => {
        console.log('Events component rendered');
    }, []);
    return <h1>Events</h1>;
}

function Evaluations() {
    useEffect(() => {
        console.log('Evaluations component rendered');
    }, []);
    return <h1>Evaluations</h1>;
}

function App() {
    const [weather, setWeather] = useState('No weather data available');
    const [events, setEvents] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const apiKeyWeather = 'd422439877407639bd97d97e3d05d479';
    const city = 'Richardson'; // Richardson, Texas
    const apiKeySmartsheet = ''; // Add your Smartsheet API key here
    const sheetId = 'YOUR_SHEET_ID'; // Replace with your sheet ID

    useEffect(() => {
        console.log('App component rendered');
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (apiKeyWeather && city) {
            fetchWeather();
        }
        if (apiKeySmartsheet && sheetId) {
            fetchAgenda();
        }
    }, []);

    const fetchWeather = () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=imperial`;
        axios.get(url)
            .then(response => {
                const weatherData = response.data;
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                setWeather(`Temperature: ${temp}°F, ${description}`);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    };

    const fetchAgenda = () => {
        const url = `https://api.smartsheet.com/2.0/sheets/${sheetId}`;
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${apiKeySmartsheet}`
            }
        })
        .then(response => {
            const eventsData = response.data.rows.map(row => {
                const time = row.cells.find(cell => cell.columnId === 'TIME_COLUMN_ID').value;
                const title = row.cells.find(cell => cell.columnId === 'TITLE_COLUMN_ID').value;
                const participants = row.cells.find(cell => cell.columnId === 'PARTICIPANTS_COLUMN_ID').value;
                return { time, title, participants };
            });
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
