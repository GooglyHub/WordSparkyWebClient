import React, { Component } from 'react';
import colors from '../config/colors';
import { getCurrentUser } from '../services/authService';
import gameStates from '../common/gameStates';
import utils from '../common/utils';
import StaticGame from './StaticGame';
import GuessLetters from './GuessLetters';
import GameSolve from './GameSolve';
import ViewSolve from './ViewSolve';
import PublicPuzzle from './PublicPuzzle';

class Card extends Component {
    render() {
        const { game, activeGameId, onUpdateGame } = this.props;
        const me = getCurrentUser()._id;

        return (
            <div
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                    borderColor: colors.black,
                    borderWidth: 3,
                    borderRadius: 5,
                    borderStyle: 'solid',
                    marginLeft: 5,
                    marginRight: 5,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {game.solver &&
                    game.solver._id !== me &&
                    game.creator._id === me &&
                    game.state !== gameStates.SOLVED && (
                        <StaticGame
                            boardString={utils.getBoardStringForString(
                                game.answer || ''
                            )}
                            hint={game.hint}
                            solver={game.solver.displayName}
                        />
                    )}
                {game.solver &&
                    game.solver._id === me &&
                    game.state === gameStates.NEW && (
                        <GuessLetters
                            boardString={utils.getBoardString(game)}
                            createTime={game.createTime}
                            creator={game.creator.displayName}
                            expandedInitially={game._id === activeGameId}
                            gameId={game._id}
                            hint={game.hint}
                            isPublic={game.isPublic ? true : false}
                            onUpdateGame={onUpdateGame}
                        />
                    )}
                {game.solver &&
                    game.solver._id === me &&
                    (game.state === gameStates.SOLVING ||
                        game.state === gameStates.SOLVED) && (
                        <GameSolve
                            boardString={utils.getBoardString(game)}
                            creator={game.creator.displayName}
                            expandedInitially={
                                game._id === activeGameId ||
                                game.state === gameStates.SOLVER
                            }
                            gameId={game._id}
                            guesses={game.guesses}
                            guessedLetters={game.guessedLetters}
                            hint={game.hint}
                            isPublic={game.isPublic ? true : false}
                            onUpdateGame={onUpdateGame}
                            showSolved={game.state === gameStates.SOLVED}
                        />
                    )}
                {game.solver &&
                    game.creator._id === me &&
                    game.state === gameStates.SOLVED && (
                        <ViewSolve
                            boardString={utils.getBoardStringForString(
                                game.answer
                            )}
                            gameId={game._id}
                            guesses={game.guesses}
                            guessedLetters={game.guessedLetters}
                            hint={game.hint}
                            solver={game.solver.displayName}
                        ></ViewSolve>
                    )}
                {!game.solver && (
                    <PublicPuzzle
                        boardString={utils.getBoardStringForString(game.answer)}
                        createTime={game.createTime}
                        creator={game.creator.displayName}
                        puzzleId={game._id}
                        hint={game.hint}
                        myPuzzle={game.creator._id === me}
                        onUpdateGame={onUpdateGame}
                    ></PublicPuzzle>
                )}
            </div>
        );
    }
}

export default Card;
