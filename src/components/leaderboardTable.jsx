import React, { Component } from 'react';
import colors from '../config/colors';
import LeaderboardRow from './LeaderboardRow';

const LeaderboardTable = ({ title, tableData }) => {
    return (
        <div
            style={{
                backgroundColor: colors.light,
                marginTop: 20,
                marginBottom: 20,
                borderColor: colors.black,
                borderWidth: 3,
                borderRadius: 5,
                borderStyle: 'solid',
            }}
        >
            <div
                style={{
                    backgroundColor: colors.primary,
                    color: colors.light,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                {title}
            </div>
            {tableData.map((data) => {
                return <LeaderboardRow data={data} key={data.name} />;
            })}
        </div>
    );
};

export default LeaderboardTable;
