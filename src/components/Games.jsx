import React, { Component } from 'react';
import gameStates from '../common/gameStates';
import { getGames } from '../services/gamesService';
import { getCurrentUser } from '../services/authService';
import { getCoins, collectCoins } from '../services/coinsService';
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
        nextCollect: null,
        canCollect: false,
    };

    async componentDidMount() {
        try {
            const response = await getGames();
            const response2 = await getCoins();
            this.setState({
                games: this.sortGames([...response.data]),
                error: '',
                coins: response2.data.coins,
                nextCollect: response2.data.nextCollect,
                canCollect:
                    new Date() > new Date(response2.data.nextCollect)
                        ? true
                        : false,
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

    sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    handleCoinPress = async () => {
        try {
            const response = await collectCoins();
            if (this.state.coins <= response.data.coins) {
                let val = this.state.coins;
                while (val < response.data.coins) {
                    ++val;
                    this.setState({ coins: val });
                    await this.sleep(300);
                }
            } else {
                this.setState({ coins: response.data.coins });
            }
            this.setState({
                nextCollect: response.data.canCollect,
                canCollect: false,
            });
        } catch (error) {
            this.setState({
                error: 'Error collecting coins: ' + error.response.data,
            });
        }
    };

    formatTime = (s) => {
        let hours = Math.floor(s / 3600);
        let minutes = Math.floor((s - hours * 3600) / 60);
        if (hours > 1) {
            return `in ${hours} hours`;
        } else if (hours === 1) {
            return 'in 1 hour';
        } else if (minutes > 1) {
            return `in ${minutes} minutes`;
        } else {
            return 'soon';
        }
    };

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
                    onClick={() => {
                        if (this.state.canCollect) {
                            this.handleCoinPress();
                        } else {
                            let message = 'Bonus coin every day';
                            if (this.state.nextCollect) {
                                const secondsToWait = Math.floor(
                                    (new Date(this.state.nextCollect) -
                                        new Date()) /
                                        1000
                                );
                                if (secondsToWait > 0) {
                                    message = `Bonus coin available ${this.formatTime(
                                        secondsToWait
                                    )}`;
                                } else {
                                    message = 'Bonus coin is available';
                                    this.setState({ canCollect: true });
                                }
                            }
                            this.setState({ message });
                        }
                    }}
                >
                    {this.state.canCollect && (
                        <Icon
                            name="dots-horizontal-circle-outline"
                            backgroundColor={colors.gold}
                            iconColor={colors.primary}
                            size={25}
                            marginRight={5}
                        ></Icon>
                    )}
                    {!this.state.canCollect && (
                        <Icon
                            name="dots-horizontal-circle-outline"
                            backgroundColor={colors.light}
                            iconColor={colors.primary}
                            size={25}
                            marginRight={5}
                        ></Icon>
                    )}
                    <span>{this.state.coins}</span>
                </div>
                <div style={{ height: 30 }} />
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-success alert-dismissable">
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
                            setCoins={this.setCoins}
                            activeGameId={this.state.activeGameId}
                        />
                    );
                })}
            </>
        );
    }
}

export default Games;
