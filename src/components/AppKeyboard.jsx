import React from 'react';
import colors from '../config/colors';
import GameRow from './GameRow';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '', 'DEL'],
];

function AppKeyboard({ disabledKeys = [], onPress }) {
    const rows = [];
    for (let i = 0; i < keyboardLayout.length; ++i) {
        const row = [];
        for (let j = 0; j < keyboardLayout[i].length; ++j) {
            if (keyboardLayout[i][j] === '') {
                row.push({
                    state: 'given',
                    key: ' ',
                    isPressable: false,
                });
            } else if (disabledKeys.includes(keyboardLayout[i][j])) {
                row.push({
                    state: 'disabled',
                    key: keyboardLayout[i][j],
                    isPressable: false,
                });
            } else {
                row.push({
                    state: 'given',
                    key: keyboardLayout[i][j],
                    isPressable: true,
                    pressData: { key: keyboardLayout[i][j] },
                });
            }
        }
        rows.push(row);
    }

    const isEnabled = (c) => {
        if (c.length === 0) return false;
        if (c.length > 1) return true;
        return !disabledKeys.includes(c);
    };

    const onClick = (key) => {
        if (onPress) {
            onPress({ key });
        }
    };

    const keyPressed = (event) => {
        event.stopPropagation();
        let key = event.key;
        if (key.length === 1 && key >= 'a' && key <= 'z') {
            key = key.toUpperCase();
        }
        if (key === 'Backspace') {
            onClick('DEL');
        } else if (key === 'Enter') {
            onClick('Enter');
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
            if (isEnabled(key)) {
                onClick(key);
            }
        }
    };

    return (
        <div
            style={{
                backgroundColor: colors.secondary,
                paddingTop: 15,
                paddingBottom: 15,
            }}
            tabIndex="0"
            onKeyUp={(e) => {
                keyPressed(e);
            }}
        >
            {rows.map((row, idx) => (
                <GameRow
                    row={row}
                    marginHorizontal={1}
                    marginVertical={6}
                    height={32}
                    width={32}
                    key={idx}
                    onPress={onPress}
                    changeColorOnHover
                />
            ))}
        </div>
    );
}

export default AppKeyboard;
