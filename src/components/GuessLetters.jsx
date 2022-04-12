import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import { guessLetters } from '../services/gamesService';
import { deleteGame, rejectBotPuzzle } from '../services/gamesService';
import AppKeyboard from './AppKeyboard';
import colors from './../config/colors';
import GameCell from './GameCell';

const NUM_SLOTS = 6;

class GuessLetters extends Component {
    createInitialLetters() {
        let initialLetters = [];
        for (let i = 0; i < NUM_SLOTS; ++i) {
            initialLetters.push('?');
        }
        return initialLetters;
    }

    state = {
        expanded: this.props.expandedInitially,
        letters: this.createInitialLetters(),
        error: null,
    };

    createCell = (ch) => {
        if (ch === '?') {
            return {
                state: 'unknown',
                key: '?',
                isPressable: false,
            };
        } else {
            return {
                state: 'guess',
                key: ch,
                isPressable: false,
            };
        }
    };

    // This is called once the user has chosen the six letters
    // to begin a solve (e.g. R-S-T-L-N-E)
    handleChosenLetters = async () => {
        let letters = '';
        for (let i = 0; i < NUM_SLOTS; ++i) {
            letters += this.state.letters[i];
        }

        try {
            const response = await guessLetters({
                guess: letters,
                gameId: this.props.gameId,
            });
            this.props.onUpdateGame(response.data);
        } catch (ex) {
            if (ex.response && ex.response.data) {
                this.setState({
                    error: ex.response.data,
                });
            } else {
                this.setState({
                    error: 'Error submitting request',
                });
            }
        }
    };

    onKeyPress = (key) => {
        // need to check that the key is not disabled
        if (
            key.length > 1 ||
            (key.length === 1 && !this.state.letters.includes(key))
        ) {
            this.handlePress({ key });
        }
    };

    handlePress = (data) => {
        const key = data.key;
        if (key === 'DEL') {
            for (let i = NUM_SLOTS - 1; i >= 0; --i) {
                if (this.state.letters[i] !== '?') {
                    const newLetters = [...this.state.letters];
                    newLetters[i] = '?';
                    this.setState({ letters: newLetters });
                    break;
                }
            }
        } else if (key === 'Enter') {
            if (NUM_SLOTS > 0 && this.state.letters[NUM_SLOTS - 1] !== '?') {
                this.handleChosenLetters();
            }
        } else {
            for (let i = 0; i < NUM_SLOTS; ++i) {
                if (this.state.letters[i] === '?') {
                    const newLetters = [...this.state.letters];
                    newLetters[i] = key;
                    this.setState({ letters: newLetters });
                    break;
                }
            }
        }
    };

    setExpanded = (expanded) => {
        this.setState({ expanded });
    };

    render() {
        const {
            boardString,
            botPuzzleId,
            creator,
            creatorIcon,
            creatorColor,
            createTime,
            gameId,
            hasSolver,
            hint,
            isBotPuzzle,
            onRemoveGame,
        } = this.props;

        return (
            <>
                <CardHeader
                    chevron={this.state.expanded ? 'up' : 'down'}
                    iconColor={creatorColor}
                    iconName={creatorIcon}
                    onClick={() => {
                        this.setExpanded(!this.state.expanded);
                    }}
                    title={
                        isBotPuzzle
                            ? `${creator} Bot Puzzle`
                            : `${creator} sent a puzzle (${utils.getAgeString(
                                  createTime
                              )})`
                    }
                    onDelete={
                        onRemoveGame
                            ? (e) => {
                                  e.stopPropagation();
                                  if (
                                      window.confirm(
                                          'Are you sure you want to delete this puzzle?'
                                      )
                                  ) {
                                      if (hasSolver) {
                                          deleteGame({ gameId });
                                      } else {
                                          rejectBotPuzzle(botPuzzleId);
                                      }
                                      onRemoveGame(gameId);
                                  }
                              }
                            : null
                    }
                />
                <GameBody
                    hint={hint}
                    board={utils.decompress(boardString)}
                    onClick={() => {
                        this.setExpanded(true);
                    }}
                    onKeyPress={this.onKeyPress}
                ></GameBody>
                {this.state.expanded && (
                    <>
                        <CardHeader title={`Choose ${NUM_SLOTS} letters`} />{' '}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                paddingLeft: 10,
                                paddingVertical: 5,
                                backgroundColor: colors.secondary,
                                alignItems: 'center',
                            }}
                            tabIndex="0"
                            onKeyUp={(event) => {
                                event.stopPropagation();
                                let key = event.key;
                                if (
                                    key.length === 1 &&
                                    key >= 'a' &&
                                    key <= 'z'
                                ) {
                                    key = key.toUpperCase();
                                }
                                if (key === 'Backspace') {
                                    this.onKeyPress('DEL');
                                } else if (key === 'Enter') {
                                    this.onKeyPress('Enter');
                                } else if (
                                    key.length === 1 &&
                                    key >= 'A' &&
                                    key <= 'Z'
                                ) {
                                    this.onKeyPress(key);
                                }
                            }}
                        >
                            {this.state.letters.map((letter, idx) => (
                                <GameCell
                                    cell={this.createCell(letter)}
                                    marginHorizontal={3}
                                    key={idx}
                                />
                            ))}
                            <div
                                style={{
                                    marginLeft: 10,
                                    borderWidth: 2,
                                    borderColor: colors.primary,
                                }}
                            >
                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleChosenLetters}
                                    disabled={
                                        NUM_SLOTS > 0 &&
                                        this.state.letters[NUM_SLOTS - 1] ===
                                            '?'
                                    }
                                >
                                    Submit
                                </button>
                            </div>
                        </div>{' '}
                        <AppKeyboard
                            disabledKeys={this.state.letters}
                            onPress={this.handlePress}
                        />
                    </>
                )}
                {this.state.error && (
                    <div
                        className="alert alert-danger"
                        style={{ marginBottom: 0 }}
                        role="alert"
                    >
                        {this.state.error}
                    </div>
                )}
            </>
        );
    }
}

export default GuessLetters;
