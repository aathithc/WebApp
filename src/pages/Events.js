// Events.js
import React, { useEffect } from 'react';

function Events() {
    useEffect(() => {
        console.log('Events component rendered');
    }, []);

    return <h1>Events</h1>;
}

export default Events;
