import React, { Component } from 'react';
import gameStates from '../common/gameStates';
import { getGames } from '../services/gamesService';
import { getCurrentUser } from '../services/authService';
import { getCoins } from '../services/coinsService';
import Card from './Card';
import Icon from './common/icon';
import colors from './../config/colors';

class Games extends Component {
    state = {
        games: [],
        activeGameId: '',
        error: '',
        message: '',
        coins: 0,
    };

    async componentDidMount() {
        try {
            const gamesResponseData = (await getGames()).data;
            const coinsResponse = await getCoins();
            this.setState({
                games: this.sortGames([...gamesResponseData]),
                error: '',
                coins: coinsResponse.data.coins,
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.data) {
                this.setState({
                    games: [],
                    error: `Error fetching games: ${ex.response.data}`,
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

        const user = getCurrentUser();
        const myId = (user && user._id) || '-1';
        const getFirstTieBreaker = (game) => {
            const solverId = (game.solver && game.solver._id) || '';
            if (game.state === gameStates.SOLVED && solverId !== myId) {
                return 0;
            }
            if (game.state === gameStates.SOLVED && solverId === myId) {
                return 1;
            }
            if (game.state === gameStates.SOLVING && solverId === myId) {
                return 2;
            }
            if (game.state === gameStates.NEW && solverId === myId) {
                return 3;
            }
            if (game.solver) {
                return 4;
            }
            return 5;
        };

        newGames.sort((a, b) => {
            // The order of games to present to the user is:
            // 0 - View solves (SOLVED)
            // 1 - We solved a puzzle (SOLVED)
            // 2 - Continue solving (SOLVING)
            // 3 - Start solving new puzzles (NEW)
            // 4 - Show puzzles we created that are waiting to be solved
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

    setCoins = (coins) => {
        this.setState({ coins });
    };

    render() {
        return (
            <>
                <div
                    style={{
                        position: 'absolute',
                        right: 25,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        display: 'flex',
                    }}
                >
                    <Icon
                        name="dots-horizontal-circle-outline"
                        backgroundColor={colors.gold}
                        iconColor={colors.primary}
                        size={25}
                        marginRight={5}
                    ></Icon>
                    <span>{this.state.coins}</span>
                </div>
                <div style={{ height: 30 }} />
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-warning alert-dismissable">
                        {this.state.message}
                    </div>
                )}
                {this.state.games.map((game) => {
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
                            setCoins={this.setCoins}
                            coins={this.state.coins}
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
