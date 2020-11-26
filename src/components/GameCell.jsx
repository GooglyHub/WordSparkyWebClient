import React from 'react';
import colors from '../config/colors';
import Icon from '@mdi/react';
import { mdiBackspace } from '@mdi/js';

function GameCell({
    cell,
    cursor,
    rowIdx,
    colIdx,
    marginHorizontal = 0,
    height = 30,
    width = 30,
    onPress,
}) {
    const GameCellComponent = (
        <div
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 1,
                marginLeft: marginHorizontal,
                marginRight: marginHorizontal,
                height,
                width,
                cursor: 'pointer',
            }}
        >
            {cell.key !== ' ' &&
                ((cell.key === 'DEL' && (
                    <div
                        style={{
                            borderWidth: 2,
                            borderStyle: 'solid',
                            borderRadius: 50,
                            borderColor: colors.black,
                            backgroundColor: 'yellow',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            cursor: 'pointer',
                            padding: 3,
                        }}
                    >
                        <Icon
                            path={mdiBackspace}
                            color={colors.black}
                            size={0.8}
                        />
                    </div>
                )) || (
                    <div
                        style={getStylesForCell(
                            cell,
                            cursor &&
                                cursor.row === rowIdx &&
                                cursor.col === colIdx
                        )}
                    >
                        {cell.key}
                    </div>
                ))}
        </div>
    );

    if (cell.isPressable && cell.pressData) {
        return (
            <div onClick={() => onPress(cell.pressData)}>
                {GameCellComponent}
            </div>
        );
    } else {
        return <div>{GameCellComponent}</div>;
    }
}

const getStylesForCell = (cell, hasCursor) => {
    const style = {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.black,
        borderStyle: 'solid',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    };
    if (cell.state === 'unknown') {
        style.backgroundColor = colors.gray;
        style.color = colors.lightgray;
    } else if (cell.state === 'disabled') {
        style.backgroundColor = colors.gray;
        style.color = 'gray';
    } else if (cell.state === 'guess') {
        style.backgroundColor = colors.guess;
        style.color = colors.black;
    } else if (cell.state === 'right') {
        style.backgroundColor = colors.right;
        style.color = colors.black;
    } else if (cell.state === 'wrong') {
        style.backgroundColor = colors.wrong;
        style.color = colors.black;
    } else {
        style.backgroundColor = colors.given;
        style.color = colors.black;
    }
    if (hasCursor) {
        style.borderWidth = 2;
        style.borderColor = colors.cursorBorder;
    }
    if (cell.isPressable && cell.pressData) {
        style.cursor = 'pointer';
    }
    return style;
};

export default GameCell;
