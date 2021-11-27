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
        const { game, activeGameId, onUpdateGame, onRemoveGame, setCoins } =
            this.props;
        const user = getCurrentUser();
        const myId = (user && user._id) || '-1';
        const solverId = (game.solver && game.solver._id) || '';
        const creatorId = (game.creator && game.creator._id) || '';

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
                {solverId !== myId &&
                    game.creator &&
                    creatorId === myId &&
                    game.state !== gameStates.SOLVED && (
                        <StaticGame
                            boardString={utils.getBoardStringForString(
                                game.answer || ''
                            )}
                            hint={game.hint}
                            solver={
                                (game.solver && game.solver.name) ||
                                'Sparky Bot'
                            }
                        />
                    )}
                {solverId === myId && game.state === gameStates.NEW && (
                    <GuessLetters
                        answer={game.answer}
                        boardString={utils.getBoardString(game)}
                        createTime={game.createTime}
                        creator={
                            game.creator
                                ? game.creator.name
                                : game.creatorBot
                                ? game.creatorBot.name
                                : ''
                        }
                        expandedInitially={
                            game._id === activeGameId || game.active
                        }
                        gameId={game._id}
                        hint={game.hint}
                        onUpdateGame={onUpdateGame}
                        onRemoveGame={game.creatorBot ? onRemoveGame : null}
                        setCoins={setCoins}
                    />
                )}
                {solverId === myId &&
                    (game.state === gameStates.SOLVING ||
                        game.state === gameStates.SOLVED) && (
                        <GameSolve
                            answer={game.answer}
                            boardString={utils.getBoardString(game)}
                            creator={
                                game.creator
                                    ? game.creator.name
                                    : game.creatorBot
                                    ? game.creatorBot.name
                                    : ''
                            }
                            expandedInitially={
                                game._id === activeGameId ||
                                game.state === gameStates.SOLVED ||
                                game.active
                            }
                            gameId={game._id}
                            guesses={game.guesses}
                            guessedLetters={game.guessedLetters}
                            hint={game.hint}
                            onUpdateGame={onUpdateGame}
                            onRemoveGame={
                                game.creatorBot ||
                                game.state === gameStates.SOLVED
                                    ? onRemoveGame
                                    : null
                            }
                            setCoins={setCoins}
                            showSolved={game.state === gameStates.SOLVED}
                        />
                    )}
                {creatorId === myId && game.state === gameStates.SOLVED && (
                    <ViewSolve
                        boardString={utils.getBoardStringForString(game.answer)}
                        gameId={game._id}
                        guesses={game.guesses}
                        guessedLetters={game.guessedLetters}
                        hint={game.hint}
                        notifyServer={game._id ? true : false}
                        onRemoveGame={onRemoveGame}
                        solver={
                            (game.solver && game.solver.name) || 'Sparky Bot'
                        }
                    ></ViewSolve>
                )}
            </div>
        );
    }
}

export default Card;
