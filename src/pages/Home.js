// Home.js
import React, { useEffect } from 'react';

function Home() {
    useEffect(() => {
        console.log('Home component rendered');
    }, []);

    return <h1>Welcome to ETS Laboratories</h1>;
}

export default Home;
