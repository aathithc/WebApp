// Evaluations.js
import React, { useEffect } from 'react';

function Evaluations() {
    useEffect(() => {
        console.log('Evaluations component rendered');
    }, []);

    return <h1>Evaluations</h1>;
}

export default Evaluations;
