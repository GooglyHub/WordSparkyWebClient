import React, { Component } from 'react';
import gameStates from '../common/gameStates';
import { getGames } from '../services/gamesService';
import { getCurrentUser } from '../services/authService';
import Card from './Card';

class Games extends Component {
    state = {
        games: [],
        activeGameId: '',
        error: null,
    };

    async componentDidMount() {
        try {
            const response = await getGames();
            this.setState({
                games: this.sortGames([...response.data]),
                error: null,
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response) {
                this.setState({
                    games: [],
                    error: ex.response.data,
                });
            } else {
                this.setState({
                    games: [],
                    error: 'Error fetching games',
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
        const me = getCurrentUser()._id;
        const getFirstTieBreaker = (game) => {
            if (game.solver && game.state === gameStates.SOLVED) return 0;
            if (
                game.solver &&
                game.state === gameStates.SOLVING &&
                game.solver._id === me
            )
                return 1;
            if (
                game.solver &&
                game.state === gameStates.NEW &&
                game.solver._id === me
            )
                return 2;
            if (game.solver) return 3;
            return 4;
        };

        newGames.sort((a, b) => {
            // The order of games to present to the user is:
            // 0 - View solves (SOLVED)
            // 1 - Continue solving (SOLVING)
            // 2 - Start solving new puzzles (NEW)
            // 3 - Show puzzles we created that are waiting to be solved
            // 4 - Public puzzles
            // Within each group, sort by creation time, earliest first for 0-3,
            // most recent first for 4
            const scoreA = getFirstTieBreaker(a);
            const scoreB = getFirstTieBreaker(b);
            if (scoreA < scoreB) return -1;
            if (scoreA > scoreB) return 1;

            const dateA = new Date(a.createTime).getTime();
            const dateB = new Date(b.createTime).getTime();

            if (scoreA !== 4) {
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;
            } else {
                if (dateA < dateB) return 1;
                if (dateA > dateB) return -1;
            }
            return 0;
        });
        return newGames;
    };

    render() {
        return (
            <>
                <div style={{ marginLeft: 20, marginRight: 20 }}>
                    {this.state.error && <span>{this.state.error}</span>}
                </div>
                {this.state.games.map((game) => {
                    return (
                        <Card
                            key={game._id}
                            game={game}
                            onUpdateGame={(newGame) => {
                                this.updateGame(game._id, newGame);
                            }}
                            activeGameId={this.state.activeGameId}
                        />
                    );
                })}
            </>
        );
    }
}

export default Games;
