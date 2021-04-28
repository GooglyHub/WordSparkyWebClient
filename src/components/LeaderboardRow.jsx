import React from 'react';
import colors from '../config/colors';
import Icon from './common/icon';

function LeaderboardRow({ data }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
            }}
        >
            <Icon
                name={data.icon || 'account'}
                backgroundColor={data.color || 'blue'}
                size={40}
            ></Icon>
            <div style={{ marginLeft: 10, justifyContent: 'center', flex: 1 }}>
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
        </div>
    );
}

export default LeaderboardRow;
