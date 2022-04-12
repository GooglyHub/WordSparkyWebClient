import React, { Component } from 'react';
import gameStates from '../common/gameStates';
import { getGames, getBotPuzzle } from '../services/gamesService';
import { getCurrentUser } from '../services/authService';
import Card from './Card';

class Games extends Component {
    state = {
        games: [],
        activeGameId: '',
        error: '',
        message: '',
        loading: false,
    };

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const gamesResponseData = (await getGames()).data;
            this.setState({
                games: this.sortGames([...gamesResponseData]),
                error: '',
                loading: false,
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.data) {
                this.setState({
                    games: [],
                    error: `Error fetching games: ${ex.response.data}`,
                    loading: false,
                });
            } else {
                this.setState({
                    games: [],
                    error: 'Error fetching games',
                    loading: false,
                });
            }
        }
    }

    updateGame(gameId, newGame) {
        const newGames = [...this.state.games];
        for (let i = 0; i < newGames.length; ++i) {
            if (newGames[i]._id === gameId) {
                newGames[i] = newGame;
                break;
            }
        }
        this.setState({
            games: newGames,
            activeGameId: newGame._id,
        });
    }

    sortGames = (unsortedGames) => {
        const newGames = [...unsortedGames];

        const user = getCurrentUser();
        const myId = (user && user._id) || '-1';
        const getFirstTieBreaker = (game) => {
            if (game.state === gameStates.SOLVED && game.solver?._id !== myId) {
                return 0;
            }
            if (
                (game.state === gameStates.SOLVING ||
                    game.state === gameStates.SOLVED) &&
                game.solver?._id === myId
            ) {
                return 1;
            }
            if (game.state === gameStates.NEW && game.solver?._id === myId) {
                return 2;
            }
            if (game.creator?._id === myId) {
                return 3;
            }
            return 4;
        };

        newGames.sort((a, b) => {
            // The order of games to present to the user is:
            // 0 - View solves (SOLVED)
            // 1 - We solved a puzzle (SOLVED) or continue solving (SOLVING)
            // 2 - Start solving new puzzles (NEW)
            // 3 - Show puzzles we created that are waiting to be solved
            // Within each group, sort by creation time
            const scoreA = getFirstTieBreaker(a);
            const scoreB = getFirstTieBreaker(b);
            if (scoreA < scoreB) return -1;
            if (scoreA > scoreB) return 1;
            const dateA = new Date(a.createTime).getTime();
            const dateB = new Date(b.createTime).getTime();
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });
        return newGames;
    };

    removeGame(gameId) {
        const newGames = this.state.games.filter((g) => g._id !== gameId);
        this.setState({
            games: newGames,
        });
    }

    async getRandomBotPuzzle() {
        try {
            const data = (await getBotPuzzle()).data;
            const currGames = this.state.games;
            this.setState({
                games: [...currGames, data],
                error: '',
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.data) {
                this.setState({
                    games: [],
                    error: `Error getting bot puzzle: ${ex.response.data}`,
                });
            } else {
                this.setState({
                    games: [],
                    error: 'Error getting bot puzzle',
                });
            }
        }
    }

    getData(games) {
        const user = getCurrentUser();
        const myId = (user && user._id) || '-1';
        let workableGames = 0;
        for (const game of games) {
            const solverId = (game.solver && game.solver._id) || '';
            if (
                user &&
                (game.creatorBot || solverId === myId) &&
                game.state !== gameStates.SOLVED
            ) {
                ++workableGames;
            }
        }
        if (!this.state.loading && user && workableGames === 0) {
            return [
                ...games,
                {
                    _id: '0',
                    getRandomBotPuzzle: this.getRandomBotPuzzle.bind(this),
                },
            ];
        } else {
            return games;
        }
    }

    render() {
        return (
            <>
                <div style={{ height: 30 }} />
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-warning alert-dismissable">
                        {this.state.message}
                    </div>
                )}
                {this.getData(this.state.games).map((game) => {
                    return (
                        <Card
                            key={game._id}
                            game={game}
                            onUpdateGame={(newGame) => {
                                this.updateGame(game._id, newGame);
                            }}
                            onRemoveGame={(gameId) => {
                                this.removeGame(gameId);
                            }}
                            activeGameId={this.state.activeGameId}
                        />
                    );
                })}
                {/* {this.state.games.length === 0 && (
                    <div className="alert alert-warning alert-dismissable">
                        You have no active games!
                    </div>
                )} */}
            </>
        );
    }
}

export default Games;
