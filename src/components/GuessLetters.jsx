import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import LettersInput from './LettersInput';
import { guessLetters } from '../services/gamesService';

class GuessLetters extends Component {
    state = {
        expanded: this.props.expandedInitially,
        error: null,
    };

    // This is called once the user has chosen the six letters
    // to begin a solve (e.g. R-S-T-L-N-E)
    handleChosenLetters = async (letters) => {
        try {
            const response = await guessLetters({
                guess: letters,
                gameId: this.props.gameId,
            });
            this.props.onUpdateGame(response.data);
            // if (response.data.state === 'SOLVED') coins += 1;
        } catch (ex) {
            console.log(ex);
            const newState = { ...this.state };
            if (ex.response) {
                newState.error = ex.response.data;
            } else {
                newState.error = 'Error submitting request';
            }
            this.setState(newState);
        }
    };

    setExpanded = (expanded) => {
        const newState = { ...this.state };
        newState.expanded = expanded;
        this.setState(newState);
    };

    render() {
        const { boardString, creator, createTime, hint, isPublic } = this.props;

        return (
            <>
                <CardHeader
                    onClick={() => {
                        this.setExpanded(true);
                    }}
                    title={
                        isPublic
                            ? `Start solving ${creator}'s public puzzle`
                            : `${creator} sent a puzzle (${utils.getAgeString(
                                  createTime
                              )})`
                    }
                />
                <GameBody
                    hint={hint}
                    board={utils.decompress(boardString)}
                ></GameBody>
                {this.state.expanded && (
                    <LettersInput
                        numSlots={6}
                        onChosenLetters={this.handleChosenLetters}
                    />
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
