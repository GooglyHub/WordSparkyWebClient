import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import LettersInput from './LettersInput';
import {
    guessLetters,
    guessLettersGuest,
    toggleExpansion,
} from '../services/gamesService';
import { getCurrentUser } from '../services/authService';
import { deleteGame } from '../services/gamesService';

class GuessLetters extends Component {
    state = {
        expanded: this.props.expandedInitially,
        error: null,
    };

    // This is called once the user has chosen the six letters
    // to begin a solve (e.g. R-S-T-L-N-E)
    handleChosenLetters = async (letters) => {
        const user = getCurrentUser();
        if (user) {
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
        } else {
            const newGame = guessLettersGuest(this.props.gameId, letters);
            if (newGame) {
                this.props.onUpdateGame(newGame);
            } else {
                this.setState({
                    error: 'Unable to update game',
                });
            }
        }
    };

    setExpanded = (expanded) => {
        this.setState({ expanded });
        toggleExpansion(this.props.gameId, expanded);
    };

    render() {
        const { boardString, creator, createTime, hint } = this.props;

        return (
            <>
                <CardHeader
                    onClick={() => {
                        //this.setExpanded(!this.state.expanded);
                        this.setExpanded(true);
                    }}
                    title={`${creator} sent a puzzle (${utils.getAgeString(
                        createTime
                    )})`}
                    onDelete={() => {
                        deleteGame({ gameId: this.props.gameId });
                        this.props.onRemoveGame(this.props.gameId);
                    }}
                />
                <GameBody
                    hint={hint}
                    board={utils.decompress(boardString)}
                    onClick={() => {
                        this.setExpanded(true);
                    }}
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
