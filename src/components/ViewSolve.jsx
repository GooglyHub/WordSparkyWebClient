import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import colors from '../config/colors';
import GameCell from './GameCell';
import { viewSolve } from '../services/gamesService';

class ViewSolve extends Component {
    state = {
        expanded: false,
        cells: utils.decompress(
            utils.getBoardStringForString(this.props.guesses[0])
        ),
        letters: this.getInitialLetters(),
        animating: false,
    };
    cellsStatic = utils.decompress(this.props.boardString);
    cancel = false;

    getInitialLetters() {
        const initialLetters = [];
        for (let i = 0; i < this.props.guessedLetters[0].length; ++i) {
            initialLetters.push('?');
        }
        return initialLetters;
    }

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

    sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    stopAnimation = () => {
        if (!this.state.animating) return;
        this.cancel = true;
    };

    startAnimation = async () => {
        if (this.state.animating) {
            return;
        }
        this.cancel = false;
        this.setState({ animating: true });

        const initialCells = utils.decompress(
            utils.getBoardStringForString(this.props.guesses[0])
        );
        const initialLetters = [];
        for (let i = 0; i < this.props.guessedLetters[0].length; ++i) {
            initialLetters.push('?');
        }
        this.setState({
            cells: initialCells,
            letters: initialLetters,
        });

        if (this.cancel) {
            this.cancel = false;
            this.setState({ animating: false });
            return;
        }
        await this.sleep(2000);

        // show the initial six guessed letters
        let currentLetters = initialLetters;
        for (let i = 0; i < this.props.guessedLetters[0].length; ++i) {
            const newLetters = [...currentLetters];
            newLetters[i] = this.props.guessedLetters[0][i];
            this.setState({ letters: newLetters });
            currentLetters = newLetters;
            if (this.cancel) {
                this.cancel = false;
                this.setState({ animating: false });
                return;
            }
            await this.sleep(500);
        }

        // fill the board with the correct letters
        if (this.cancel) {
            this.cancel = false;
            this.setState({ animating: false });
            return;
        }
        await this.sleep(2000);
        let currentCells = initialCells;
        for (let i = 0; i < currentCells.length; ++i) {
            for (let j = 0; j < currentCells[i].length; ++j) {
                if (
                    currentCells[i][j].state === 'unknown' &&
                    this.props.guessedLetters[0].indexOf(
                        this.cellsStatic[i][j].key
                    ) >= 0
                ) {
                    const newCells = [];
                    for (let ii = 0; ii < currentCells.length; ++ii) {
                        newCells.push([...currentCells[ii]]);
                    }
                    newCells[i][j].state = 'given';
                    newCells[i][j].key = this.cellsStatic[i][j].key;
                    this.setState({ cells: newCells });
                    currentCells = newCells;
                    if (this.cancel) {
                        this.cancel = false;
                        this.setState({ animating: false });
                        return;
                    }
                    await this.sleep(200);
                }
            }
        }

        // Loop until solved
        if (this.cancel) {
            this.cancel = false;
            this.setState({ animating: false });
            return;
        }
        await this.sleep(1000);
        for (let k = 1; k < this.props.guessedLetters.length; ++k) {
            let pos = 0;
            // Show the guessed letters
            for (let i = 0; i < currentCells.length; ++i) {
                for (let j = 0; j < currentCells[i].length; ++j) {
                    if (currentCells[i][j].state === 'unknown') {
                        const newCells = [];
                        for (let ii = 0; ii < currentCells.length; ++ii) {
                            newCells.push([...currentCells[ii]]);
                        }
                        newCells[i][j].state = 'guess';
                        newCells[i][j].key = this.props.guessedLetters[k][
                            pos++
                        ];
                        this.setState({ cells: newCells });
                        currentCells = newCells;
                        if (this.cancel) {
                            this.cancel = false;
                            this.setState({ animating: false });
                            return;
                        }
                        await this.sleep(400);
                    }
                }
            }
            if (this.cancel) {
                this.cancel = false;
                this.setState({ animating: false });
                return;
            }
            await this.sleep(2000);
            // Show which guessed letters are right and which are wrong
            const newCells = [];
            for (let ii = 0; ii < currentCells.length; ++ii) {
                newCells.push([...currentCells[ii]]);
            }
            for (let i = 0; i < currentCells.length; ++i) {
                for (let j = 0; j < currentCells[i].length; ++j) {
                    if (currentCells[i][j].state === 'guess') {
                        newCells[i][j].state =
                            currentCells[i][j].key ===
                            this.cellsStatic[i][j].key
                                ? 'right'
                                : 'wrong';
                    }
                }
            }
            this.setState({ cells: newCells });
            currentCells = newCells;
            if (this.cancel) {
                this.cancel = false;
                this.setState({ animating: false });
                return;
            }
            await this.sleep(2000);

            // Red turn back to question marks and green turn yellow
            const newCells2 = [];
            for (let ii = 0; ii < currentCells.length; ++ii) {
                newCells2.push([...currentCells[ii]]);
            }
            for (let i = 0; i < currentCells.length; ++i) {
                for (let j = 0; j < currentCells[i].length; ++j) {
                    if (currentCells[i][j].state === 'wrong') {
                        newCells2[i][j].state = 'unknown';
                        newCells2[i][j].key = '?';
                    } else if (currentCells[i][j].state === 'right') {
                        newCells2[i][j].state = 'given';
                    }
                }
            }
            this.setState({ cells: newCells2 });
            currentCells = newCells2;
            if (k + 1 < this.props.guessedLetters.length) {
                if (this.cancel) {
                    this.cancel = false;
                    this.setState({ animating: false });
                    return;
                }
                await this.sleep(2000);
            }
        }

        this.setState({ animating: false });
    };

    render() {
        return (
            <>
                <CardHeader
                    title={`View ${this.props.solver}'s attempt to solve`}
                    onClick={async () => {
                        if (!this.state.expanded) {
                            // notify server that the solve has been viewed
                            viewSolve({ gameId: this.props.gameId }); // does not need to await
                            this.startAnimation();
                            this.setState({ expanded: true });
                        } else {
                            this.setState({ expanded: false });
                        }
                    }}
                ></CardHeader>
                {!this.state.expanded && (
                    <GameBody
                        hint={this.props.hint}
                        board={this.cellsStatic}
                    ></GameBody>
                )}
                {this.state.expanded && (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                paddingLeft: 10,
                                paddingVertical: 5,
                                backgroundColor: colors.secondary,
                            }}
                        >
                            {this.state.letters.map((letter, idx) => (
                                <GameCell
                                    cell={this.createCell(letter)}
                                    marginHorizontal={3}
                                    key={idx}
                                />
                            ))}
                        </div>
                        <GameBody
                            hint={this.props.hint}
                            board={this.state.cells}
                        ></GameBody>
                    </>
                )}
            </>
        );
    }
}

export default ViewSolve;
