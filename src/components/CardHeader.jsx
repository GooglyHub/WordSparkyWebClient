import React from 'react';
import colors from '../config/colors';

function CardHeader({ title, onClick }) {
    return (
        <div
            style={{
                flexDirection: 'row',
                backgroundColor: colors.light,
            }}
            onClick={onClick}
        >
            <div
                style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: colors.light,
                    flex: 1,
                }}
            >
                {title}
            </div>
        </div>
    );
}

export default CardHeader;
