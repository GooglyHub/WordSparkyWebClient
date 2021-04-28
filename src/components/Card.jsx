import React, { Component } from 'react';
import colors from '../config/colors';
import { getCurrentUser } from '../services/authService';
import gameStates from '../common/gameStates';
import utils from '../common/utils';
import StaticGame from './StaticGame';
import GuessLetters from './GuessLetters';
import GameSolve from './GameSolve';
import ViewSolve from './ViewSolve';

class Card extends Component {
    render() {
        const { game, activeGameId, onUpdateGame, setCoins } = this.props;
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
                    game.creator &&
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
                            creator={
                                game.creator
                                    ? game.creator.displayName
                                    : game.creatorBot
                                    ? game.creatorBot.name
                                    : ''
                            }
                            expandedInitially={game._id === activeGameId}
                            gameId={game._id}
                            hint={game.hint}
                            onUpdateGame={onUpdateGame}
                        />
                    )}
                {game.solver &&
                    game.solver._id === me &&
                    (game.state === gameStates.SOLVING ||
                        game.state === gameStates.SOLVED) && (
                        <GameSolve
                            boardString={utils.getBoardString(game)}
                            creator={
                                game.creator
                                    ? game.creator.displayName
                                    : game.creatorBot
                                    ? game.creatorBot.name
                                    : ''
                            }
                            expandedInitially={
                                game._id === activeGameId ||
                                game.state === gameStates.SOLVER
                            }
                            gameId={game._id}
                            guesses={game.guesses}
                            guessedLetters={game.guessedLetters}
                            hint={game.hint}
                            onUpdateGame={onUpdateGame}
                            setCoins={setCoins}
                            showSolved={game.state === gameStates.SOLVED}
                        />
                    )}
                {game.creator &&
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
                            solver={
                                game.solver
                                    ? game.solver.displayName
                                    : 'Sparky Bot'
                            }
                        ></ViewSolve>
                    )}
            </div>
        );
    }
}

export default Card;
