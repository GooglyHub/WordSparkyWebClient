import React, { Component } from 'react';
import GameCell from './GameCell';
import colors from './../config/colors';
import CardHeader from './CardHeader';
import AppKeyboard from './AppKeyboard';

/*
LettersInput component is the layer between GameBody and AppKeyboard
when the user is guessing the initial six letters. (See GuessLetters)
LettersInput keeps track of the six letters that have been chosen.
*/
class LettersInput extends Component {
    createInitialLetters() {
        let initialLetters = [];
        for (let i = 0; i < this.props.numSlots; ++i) {
            initialLetters.push('?');
        }
        return initialLetters;
    }

    state = {
        letters: this.createInitialLetters(),
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

    handleSubmit = () => {
        let s = '';
        for (let i = 0; i < this.props.numSlots; ++i) {
            s += this.state.letters[i];
        }
        this.props.onChosenLetters(s);
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
            for (let i = this.props.numSlots - 1; i >= 0; --i) {
                if (this.state.letters[i] !== '?') {
                    const newLetters = [...this.state.letters];
                    newLetters[i] = '?';
                    this.setState({ letters: newLetters });
                    break;
                }
            }
        } else if (key === 'Enter') {
            if (
                this.props.numSlots > 0 &&
                this.state.letters[this.props.numSlots - 1] !== '?'
            ) {
                this.handleSubmit();
            }
        } else {
            for (let i = 0; i < this.props.numSlots; ++i) {
                if (this.state.letters[i] === '?') {
                    const newLetters = [...this.state.letters];
                    newLetters[i] = key;
                    this.setState({ letters: newLetters });
                    break;
                }
            }
        }
    };

    render() {
        return (
            <>
                <CardHeader title={`Choose ${this.props.numSlots} letters`} />
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
                        if (key.length === 1 && key >= 'a' && key <= 'z') {
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
                            onClick={this.handleSubmit}
                            disabled={
                                this.props.numSlots > 0 &&
                                this.state.letters[this.props.numSlots - 1] ===
                                    '?'
                            }
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <AppKeyboard
                    disabledKeys={this.state.letters}
                    onPress={this.handlePress}
                />
            </>
        );
    }
}

export default LettersInput;
