import React from 'react';
import colors from '../config/colors';
import GameRow from './GameRow';

// If the board contains cells that are pressable, then onPress
// callback should be passed in
function GameBody({
    hint,
    board,
    cursor,
    onPress = (ch) => {},
    onKeyPress = (key) => {},
}) {
    return (
        <div
            style={{
                backgroundColor: colors.primary,
                paddingBottom: 10,
            }}
            tabIndex="0"
            onKeyUp={(event) => {
                event.stopPropagation();
                let key = event.key;
                if (key.length === 1 && key >= 'a' && key <= 'z') {
                    key = key.toUpperCase();
                }
                if (key === 'Backspace') {
                    onKeyPress('DEL');
                } else if (key === 'Enter') {
                    onKeyPress('Enter');
                } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
                    onKeyPress(key);
                }
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
