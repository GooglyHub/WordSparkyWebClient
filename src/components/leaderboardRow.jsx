import React from 'react';
import colors from '../config/colors';

function LeaderboardRow({ data }) {
    return (
        <div
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                marginLeft: 10,
                justifyContent: 'center',
                flex: 1,
            }}
        >
            <div
                style={{
                    fontWeight: 'bold',
                }}
            >
                {data.name}
            </div>
            <div
                style={{
                    color: colors.medium,
                }}
            >
                {data.value}
            </div>
        </div>
    );
}

export default LeaderboardRow;
