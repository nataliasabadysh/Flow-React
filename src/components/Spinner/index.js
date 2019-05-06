/* @flow */

// Core
import React from 'react';

// Types
import type { Props } from './types';

// Instruments
import Styles from './styles.module.css';

export const Spinner = (props: Props) => {
    return props.isSpinning ? <div className = { Styles.spinner } /> : null;
};
