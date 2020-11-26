import React, { Component } from 'react';
import CardHeader from './CardHeader';
import GameBody from './GameBody';
import utils from '../common/utils';
import { convertToGame } from '../services/publicPuzzlesService';

class PublicPuzzle extends Component {
    state = { error: null };
    render() {
        const {
            boardString,
            createTime,
            creator,
            hint,
            myPuzzle,
            onUpdateGame,
            puzzleId,
        } = this.props;
        return (
            <>
                {!myPuzzle && (
                    <CardHeader
                        title={`Try ${creator}'s public puzzle (${utils.getAgeString(
                            createTime
                        )})`}
                        onClick={async () => {
                            if (!myPuzzle) {
                                try {
                                    // convert public puzzle to game
                                    const response = await convertToGame({
                                        puzzleId,
                                    });
                                    this.setState({ error: null });
                                    onUpdateGame(response.data);
                                } catch (ex) {
                                    console.log(ex);
                                    if (ex.response) {
                                        this.setState({
                                            error: ex.response.data,
                                        });
                                    } else {
                                        this.setState({
                                            error: 'Error starting game',
                                        });
                                    }
                                }
                            }
                        }}
                    ></CardHeader>
                )}
                <GameBody
                    hint={hint}
                    board={utils.decompress(boardString)}
                ></GameBody>
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

export default PublicPuzzle;
