import React from 'react';
import utils from '../common/utils';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import { deleteMine } from '../services/gamesService';

function StaticGame({
    boardString,
    gameId,
    hint,
    onRemoveGame,
    solver,
    solverColor,
    solverIcon,
}) {
    return (
        <>
            <CardHeader
                iconColor={solverColor}
                iconName={solverIcon}
                onDelete={
                    onRemoveGame
                        ? (e) => {
                              e.stopPropagation();
                              if (
                                  window.confirm(
                                      'Are you sure you want to delete this puzzle?'
                                  )
                              ) {
                                  deleteMine(
                                      { gameId },
                                      (response) => {
                                          onRemoveGame(gameId);
                                      },
                                      (error) => {
                                          alert(error);
                                      }
                                  );
                              }
                          }
                        : null
                }
                title={`Waiting for ${solver} to solve...`}
            />
            <GameBody hint={hint} board={utils.decompress(boardString)} />
        </>
    );
}

export default StaticGame;
