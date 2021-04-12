import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import colors from '../config/colors';
import AppKeyboard from './AppKeyboard';
import { solvePuzzle, revealLetter } from '../services/gamesService';

/*
GameSolve component
Input: Game, e.g. "? L??E ??EESE?A?E"
Output: updated Game after user makes a move, e.g. "I L??E CHEESECAKE"
 */
class GameSolve extends Component {
    state = {
        cells: utils.decompress(this.props.boardString),
        cellsStatic: utils.decompress(this.props.boardString),
        cursor: { row: -1, col: -1, idx: -1 },
        // cursorToPos is a mapping from cursor index to position in the
        //    1-dimensional answer string.
        // cursorPositions is a mapping from cursor index to position in the
        //    2-dimensional rendered answer.
        cursorPositions: [],
        cursorToPos: [],
        eliminatedLetters: [],
        error: null,
        expanded: this.props.expandedInitially,
        failed: false,
        initialized: false,
        letters: [],
        solved: this.props.showSolved,
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.guessedLetters.length !== this.props.guessedLetters.length
        ) {
            this.updateState();
        }
    }

    componentDidMount() {
        this.updateState();
    }

    updateState() {
        const {
            boardString,
            expandedInitially,
            guesses,
            guessedLetters,
            showSolved,
        } = this.props;
        const initialCells = utils.decompress(boardString);
        const initialCursorPositions = [];
        const initialLetters = [];
        let idx = 0;
        for (let row = 0; row < initialCells.length; ++row) {
            for (let col = 0; col < initialCells[row].length; ++col) {
                if (initialCells[row][col].state === 'unknown') {
                    initialCells[row][col].isPressable = true;
                    initialCells[row][col].pressData = { row, col, idx };
                    initialCursorPositions.push({ row, col, idx });
                    initialLetters.push('?');
                    ++idx;
                }
            }
        }
        // Need a mapping from cursor index to position in the answer string.
        // Just look at the "*"s in the last elements of guesses
        const initialCursorToPos = [];
        for (let i = 0; i < guesses[guesses.length - 1].length; ++i) {
            if (guesses[guesses.length - 1][i] === '*') {
                initialCursorToPos.push(i);
            }
        }
        // calculate disabled keys for each cursor position.
        // eliminatedLetters is indexed by each character of the answer.
        // Each element of eliminatedLetters is an array of chars -- the letters
        // that have been eliminated for that spot.
        const initialEliminatedLetters = [];
        // The first element of guessedLetters is the initial six-letter guess
        const initialGuess = [];
        for (let i = 0; i < guessedLetters[0].length; ++i) {
            initialGuess.push(guessedLetters[0][i]);
        }
        // e.g. initialGuess == [ 'R', 'S', 'T', 'L', 'N', 'E' ]
        for (let i = 0; i < guesses[0].length; ++i) {
            initialEliminatedLetters.push([...initialGuess]); // clone
        }
        // The remaining elements of guessedLetters refers to the "*"s of the
        // corresponding element of guesses
        for (let i = 1; i < guessedLetters.length; ++i) {
            // The number of "*"s in guesses[i] should be the same
            // as the length of guessedLetters[i]
            let k = 0; // index into guessedLetters[i]
            for (let j = 0; j < guesses[i].length; ++j) {
                if (guesses[i][j] === '*') {
                    initialEliminatedLetters[j].push(guessedLetters[i][k]);
                    ++k;
                }
            }
        }
        this.setState({
            cells: initialCells,
            cellsStatic: utils.decompress(boardString),
            cursor:
                initialCursorPositions.length > 0
                    ? initialCursorPositions[0]
                    : { row: -1, col: -1, idx: -1 },
            cursorPositions: initialCursorPositions,
            cursorToPos: initialCursorToPos,
            eliminatedLetters: initialEliminatedLetters,
            error: null,
            expanded: expandedInitially,
            failed: this.state.failed,
            initialized: true,
            letters: initialLetters,
            solved: showSolved,
        });
    }

    setExpanded = (expanded) => {
        this.setState({ expanded });
    };

    // This is called when the user clicks on one of the
    // "?" cells to move the cursor there
    handleCursorPress = ({ row, col, idx }) => {
        this.setState({ cursor: { row, col, idx } });
    };

    handleSubmit = async () => {
        const { letters } = this.state;
        const { gameId, onUpdateGame } = this.props;

        try {
            const response = await solvePuzzle({
                guess: letters.join(''),
                gameId,
            });
            if (response.data.state === 'SOLVED') {
                this.setState({
                    failed: false,
                    solved: true,
                    error: null,
                });
                // if (guessedLetters.length <= 1) {
                //    setCoins(coins + 1);
                //}
            } else if (response.data.state === 'SOLVING') {
                this.setState({
                    failed: true,
                    solved: false,
                    error: null,
                });
            }
            onUpdateGame(response.data);
        } catch (ex) {
            console.log(ex);
            if (ex.response) {
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

    handleKeyPress = (key) => {
        // need to check that the key is not disabled
        if (
            key.length > 1 ||
            (key.length === 1 &&
                !this.state.eliminatedLetters[
                    this.state.cursorToPos[this.state.cursor.idx]
                ].includes(key))
        ) {
            this.handlePress({ key });
        }
    };

    // This is called when the user presses a key on the keyboard
    handlePress = ({ key }) => {
        const {
            cells,
            cursor,
            cursorPositions,
            initialized,
            letters,
        } = this.state;

        // No unknown letters, so the keyboard should have no effect
        if (letters.length === 0) return;

        if (key === 'Enter') {
            if (initialized && !letters.includes('?')) {
                this.handleSubmit();
            }
        } else if (key === 'DEL') {
            let newCursorIdx = cursor.idx - 1;
            if (newCursorIdx < 0) {
                newCursorIdx = letters.length - 1;
            }
            const newCursor = cursorPositions[newCursorIdx];
            const newLetters = [...letters];
            newLetters[newCursorIdx] = '?';
            const newCells = [];
            // deep clone
            for (let i = 0; i < cells.length; ++i) {
                newCells.push([...cells[i]]);
            }
            newCells[newCursor.row][newCursor.col].state = 'unknown';
            newCells[newCursor.row][newCursor.col].key = '?';

            this.setState({
                cursor: newCursor,
                letters: newLetters,
                cells: newCells,
            });
        } else {
            const newCells = [];
            // deep clone
            for (let i = 0; i < cells.length; ++i) {
                newCells.push([...cells[i]]);
            }
            newCells[cursor.row][cursor.col].state = 'guess';
            newCells[cursor.row][cursor.col].key = key;

            const newLetters = [...letters];
            newLetters[cursor.idx] = key;

            let newCursorIdx = cursor.idx + 1;
            if (newCursorIdx >= letters.length) {
                newCursorIdx = 0;
            }
            const newCursor = cursorPositions[newCursorIdx];

            this.setState({
                cursor: newCursor,
                letters: newLetters,
                cells: newCells,
            });
        }
    };

    async handleReveal() {
        try {
            const response = await revealLetter({
                gameId: this.props.gameId,
                cursorIdx: this.state.cursor.idx,
                price: 10,
            });
            this.handlePress({ key: response.data.letter });
            // setCoins(response.data.coins);
        } catch (ex) {
            alert(`Error: ${ex}`);
            console.log(ex);
        }
    }

    handleHintPress() {
        if (window.confirm('Spend 5 coins to get a hint on this letter?')) {
            this.handleReveal();
        }
    }

    render() {
        const {
            cells,
            cellsStatic,
            cursorToPos,
            cursor,
            eliminatedLetters,
            error,
            expanded,
            failed,
            letters,
            initialized,
            solved,
        } = this.state;
        const { creator, hint, isPublic } = this.props;
        return (
            <>
                <CardHeader
                    onClick={() => {
                        this.setExpanded(!this.state.expanded);
                    }}
                    title={
                        isPublic
                            ? `Solve ${creator}'s public puzzle`
                            : `Solve ${creator}'s puzzle`
                    }
                ></CardHeader>
                {expanded && solved && (
                    <span
                        style={{
                            backgroundColor: colors.alertSuccessBg,
                            color: colors.alertSuccess,
                            padding: 15,
                        }}
                    >
                        Congratulations! You solved it!
                    </span>
                )}
                {expanded && failed && (
                    <span
                        style={{
                            backgroundColor: colors.alertWarningBg,
                            color: colors.alertWarning,
                            padding: 15,
                        }}
                    >
                        Not quite. Keep trying...
                    </span>
                )}
                {!expanded && (
                    <GameBody hint={hint} board={cellsStatic}></GameBody>
                )}
                {expanded && (
                    <GameBody
                        hint={hint}
                        board={cells}
                        onPress={this.handleCursorPress}
                        onKeyPress={this.handleKeyPress}
                        cursor={cursor}
                    ></GameBody>
                )}
                {expanded && !solved && (
                    <div
                        style={{
                            backgroundColor: colors.secondary,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: colors.secondary,
                                paddingTop: 5,
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 20,
                                    margin: 5,
                                    flexDirection: 'row',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    this.handleHintPress();
                                }}
                            >
                                <span
                                    class="mdi mdi-lightbulb-on-outline"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.light,
                                        borderRadius: 13,
                                        width: 25,
                                        height: 25,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        display: 'flex',
                                        marginRight: 5,
                                    }}
                                ></span>
                            </div>
                            <div
                                style={{
                                    borderWidth: 2,
                                    borderColor: colors.primary,
                                    borderStyle: 'solid',
                                }}
                            >
                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleSubmit}
                                    disabled={
                                        !initialized || letters.includes('?')
                                    }
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        <AppKeyboard
                            disabledKeys={
                                eliminatedLetters[cursorToPos[cursor.idx]]
                            }
                            onPress={this.handlePress}
                        />
                    </div>
                )}

                {error && (
                    <div
                        className="alert alert-danger"
                        style={{ marginBottom: 0 }}
                    >
                        {error}
                    </div>
                )}
            </>
        );
    }
}

//     const handleReveal = async () => {
//         setRevealLoading(true);
//         const response = await gamesApi.revealLetter({
//             gameId: gameId,
//             cursorIdx: cursor.idx,
//             price: prices.revealPrice,
//         });
//         setRevealLoading(false);

//         if (!response.ok) {
//             Alert.alert('Error', response.data);
//         } else {
//             // Simulate the user typing in the answer
//             handlePress({ key: response.data.letter });
//             setCoins(response.data.coins);
//         }
//     };

export default GameSolve;
