import React from 'react';
import colors from '../config/colors';
import GameRow from './GameRow';

// If the board contains cells that are pressable, then onPress
// callback should be passed in
function GameBody({ hint, board, cursor, onPress = (ch) => {} }) {
    return (
        <div
            style={{
                backgroundColor: colors.primary,
                paddingBottom: 10,
            }}
        >
            <div
                style={{
                    color: colors.white,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
            >
                {hint}
            </div>
            <div
                style={{
                    paddingTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {board.map((row, idx) => (
                    <GameRow
                        key={idx}
                        row={row}
                        cursor={cursor}
                        rowIdx={idx}
                        onPress={onPress}
                    ></GameRow>
                ))}
            </div>
        </div>
    );
}

export default GameBody;
