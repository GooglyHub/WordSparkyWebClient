import React from 'react';
import GameCell from './GameCell';

function GameRow({
    row,
    cursor,
    rowIdx,
    marginHorizontal,
    marginVertical = 2,
    height,
    width,
    onPress,
    changeColorOnHover = false,
}) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginHorizontal: 10,
                marginVertical,
            }}
        >
            {row.map((cell, idx) => (
                <GameCell
                    cell={cell}
                    height={height}
                    key={idx}
                    cursor={cursor}
                    rowIdx={rowIdx}
                    colIdx={idx}
                    marginHorizontal={marginHorizontal}
                    onPress={onPress}
                    width={width}
                    changeColorOnHover={changeColorOnHover}
                ></GameCell>
            ))}
        </div>
    );
}

export default GameRow;
