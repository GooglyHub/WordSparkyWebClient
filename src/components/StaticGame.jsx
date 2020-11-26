import React from 'react';
import utils from '../common/utils';
import CardHeader from './CardHeader';
import GameBody from './GameBody';

function StaticGame({ boardString, hint, solver }) {
    return (
        <>
            <CardHeader title={`Waiting for ${solver} to solve...`} />
            <GameBody hint={hint} board={utils.decompress(boardString)} />
        </>
    );
}

export default StaticGame;
