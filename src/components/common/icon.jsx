import React from 'react';

const Icon = ({
    name,
    size = 40,
    backgroundColor = 'black',
    iconColor = 'white',
    ...rest
}) => {
    return (
        <span
            style={{
                backgroundColor,
                color: iconColor,
                borderRadius: 0.5 * size,
                width: size,
                height: size,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                display: 'flex',
                fontSize: 0.75 * size,
                ...rest,
            }}
            className={`mdi mdi-${name}`}
        ></span>
    );
};

export default Icon;
