/* @flow */

// Core
import React from 'react';
import { render } from 'react-dom';

// Instruments
import './theme/init.css';

// App
import { Scheduler } from './components/Scheduler';

const root = document.getElementById('root');

if (root instanceof HTMLElement) {
    render(<Scheduler />, root);
}
