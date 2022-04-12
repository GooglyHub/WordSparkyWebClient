import React from 'react';
import utils from '../common/utils';
import CardHeader from './CardHeader';
import GameBody from './GameBody';

function StaticGame({ boardString, hint, solver, solverColor, solverIcon }) {
    return (
        <>
            <CardHeader
                iconColor={solverColor}
                iconName={solverIcon}
                title={`Waiting for ${solver} to solve...`}
            />
            <GameBody hint={hint} board={utils.decompress(boardString)} />
        </>
    );
}

export default StaticGame;
