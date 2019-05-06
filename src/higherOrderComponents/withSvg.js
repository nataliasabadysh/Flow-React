// Core
import React, { useState } from 'react';

// Instruments
import { getDisplayName } from './helpers';

export const withSvg = ({
    viewBoxWidth = 0,
    viewBoxHeight = 0,
    width = 0,
    height = 0,
} = {}) => (Component) => {
    const WithSvg = (props) => {
        const [ isHovered, setHovered ] = useState(false);
        const [ isChecked, setChecked ] = useState(props.isChecked || false);

        const filterComponentProps = () => {
            const enhanceableProps = { isHovered, isChecked, ...props };

            delete enhanceableProps.width;
            delete enhanceableProps.height;

            return enhanceableProps;
        };

        const getSvgStyle = () => ({
            width:   props.width,
            height:  props.height,
            display: 'block',
        });

        const getWrapperStyle = () => ({
            width:   props.width,
            height:  props.height,
            display: props.inlineBlock ? 'inline-block' : 'block',
        });

        const handleClick = () => setChecked(!isChecked);

        return (
            <div
                className = { props.className }
                style = { getWrapperStyle() }
                onClick = { props.onClick || handleClick }
                onMouseEnter = { props.disabled ? null : () => setHovered(true) }
                onMouseLeave = { props.disabled ? null : () => setHovered(false) }>
                <svg
                    style = { getSvgStyle() }
                    version = '1.1'
                    viewBox = { `0 0 ${viewBoxWidth} ${viewBoxHeight}` }>
                    <Component { ...filterComponentProps() } />
                </svg>
            </div>
        );
    };

    WithSvg.displayName = `withSvg(${getDisplayName(Component)})`;

    WithSvg.defaultProps = {
        color1:    '#f00',
        isChecked: false,
        width,
        height,
    };

    return WithSvg;
};
