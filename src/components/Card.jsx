import React, { Component } from 'react';
import colors from '../config/colors';
import { getCurrentUser } from '../services/authService';
import gameStates from '../common/gameStates';
import utils from '../common/utils';
import StaticGame from './StaticGame';
import GuessLetters from './GuessLetters';
import GameSolve from './GameSolve';
import ViewSolve from './ViewSolve';
import profile from '../common/profile';
import NoPuzzlesCard from './NoPuzzlesCard';

class Card extends Component {
    render() {
        const { game, activeGameId, onUpdateGame, onRemoveGame } = this.props;
        const user = getCurrentUser();
        const myId = (user && user._id) || '-1';
        const solverId = (game.solver && game.solver._id) || '';
        const creatorId = (game.creator && game.creator._id) || '';
        const creatorName = game.creator
            ? profile.getUsername(game.creator)
            : game.creatorBot
            ? game.creatorBot.name
            : '';
        const creatorIcon = game.creator
            ? profile.getIcon(game.creator)
            : game.creatorBot
            ? game.creatorBot.icon
            : '';
        const creatorColor = game.creator
            ? profile.getColor(game.creator)
            : game.creatorBot
            ? game.creatorBot.color
            : '';

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
                    creatorId === myId &&
                    game.state !== gameStates.SOLVED && (
                        <StaticGame
                            boardString={utils.getBoardStringForString(
                                game.answer
                            )}
                            hint={game.hint}
                            solver={profile.getUsername(game.solver)}
                            solverColor={profile.getColor(game.solver)}
                            solverIcon={profile.getIcon(game.solver)}
                        />
                    )}
                {(solverId === myId || game.creatorBot) &&
                    game.state === gameStates.NEW && (
                        <GuessLetters
                            boardString={utils.getBoardString(game.guesses)}
                            botPuzzleId={game.botPuzzle}
                            createTime={game.createTime}
                            creator={creatorName}
                            creatorColor={creatorColor}
                            creatorIcon={creatorIcon}
                            expandedInitially={
                                game._id === activeGameId || game.active
                            }
                            gameId={game._id}
                            hasSolver={game.solver ? true : false}
                            hint={game.hint}
                            isBotPuzzle={game.creatorBot ? true : false}
                            onUpdateGame={onUpdateGame}
                            onRemoveGame={onRemoveGame}
                        />
                    )}
                {(solverId === myId || game.creatorBot) &&
                    (game.state === gameStates.SOLVING ||
                        game.state === gameStates.SOLVED) && (
                        <GameSolve
                            creator={creatorName}
                            creatorColor={creatorColor}
                            creatorIcon={creatorIcon}
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
                            onRemoveGame={onRemoveGame}
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
                        onRemoveGame={onRemoveGame}
                        solver={profile.getUsername(game.solver)}
                        solverColor={profile.getColor(game.solver)}
                        solverIcon={profile.getIcon(game.solver)}
                    ></ViewSolve>
                )}
                {game.getRandomBotPuzzle && (
                    <NoPuzzlesCard onClick={game.getRandomBotPuzzle} />
                )}
            </div>
        );
    }
}

export default Card;
