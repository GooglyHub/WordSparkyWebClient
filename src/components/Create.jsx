import React from 'react';
import Joi from 'joi-browser';
import { getFriends } from '../services/friendsService';
import { addGame, addGameForBot } from '../services/gamesService';
//import { coinEarned } from '../services/coinsService';
import Form from './common/form';

const hints = [
    { value: 'I CANNOT BELIEVE THAT ...', _id: '1' },
    { value: "I DIDN'T KNOW THAT ...", _id: '2' },
    { value: 'TODAY ... ', _id: '3' },
    { value: 'PLEASE TELL ME ...', _id: '4' },
    { value: 'I PLAN TO ...', _id: '5' },
    { value: 'I PREDICT ...', _id: '6' },
    { value: 'I FORGOT ...', _id: '7' },
    { value: "I'M GLAD ...", _id: '8' },
    { value: 'I WONDER ...', _id: '9' },
    { value: 'CONFESSION', _id: '10' },
];

class Create extends Form {
    state = {
        friends: [],
        coins: 0,
        data: {
            hint: '1',
            answer: '',
            solver: '',
        },
        errors: {},
        error: '',
        message: '',
    };

    schema = {
        hint: Joi.string().min(1).label('Hint'),
        answer: Joi.string()
            .regex(/(?=.*[A-Za-z])^[-A-Za-z0-9.,?!'" ]+$/, 'answer')
            .min(1)
            .max(128)
            .label('Answer'),
        solver: Joi.string().min(1).label('Solver'),
    };

    async componentDidMount() {
        const sparkyBot = {
            _id: '-1',
            name: 'Sparky Bot',
        };
        const findUser = {
            _id: '*',
            name: 'Find User by ID...',
        };
        try {
            const response = await getFriends();
            this.setState({
                friends: [...response.data, sparkyBot, findUser],
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    doSubmit = async () => {
        try {
            const { hint, answer, solver } = this.state.data;
            if (answer.trim().length === 0) {
                return;
            }
            let hintString = '';
            for (const obj of hints) {
                if (obj._id === hint) {
                    hintString = obj.value;
                }
            }
            const game = {
                answer: answer.toUpperCase(),
                hint: hintString.toUpperCase(),
                solverId: solver,
            };
            if (solver === '-1') {
                delete game.solverId;
                await addGameForBot(game);
            } else {
                if (solver[0] === '*') {
                    if (solver.length <= 1) {
                        return;
                    }
                    delete game.solverId;
                    game['solverUserId'] = solver.substring(1);
                }
                await addGame(game);

                // try {
                //     await coinEarned();
                // } catch (error) {
                //     // Over daily limit? Not fatal
                // }
            }
            this.setState({
                data: {
                    hint: '1',
                    answer: '',
                    solver: '',
                },
                error: '',
                message: 'Puzzle has been created',
            });
            const elements = document.getElementsByTagName('select');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].selectedIndex = 0;
            }
        } catch (error) {
            if (error.response && error.response.data) {
                this.setState({
                    error: error.response.data,
                    message: '',
                });
            } else {
                console.log(error);
                this.setState({
                    error: 'Error creating game',
                    message: '',
                });
            }
        }
    };

    render() {
        return (
            <>
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 5,
                    }}
                >
                    Create a Puzzle
                </div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    {this.renderSelect('hint', 'Hint', hints, 'value', false)}
                    {this.renderInput('answer', 'Answer')}
                    {this.renderSelect(
                        'solver',
                        'Send to',
                        this.state.friends,
                        'name',
                        true,
                        (val) => {
                            if (val === '*') {
                                // the user selected "Find User by Id"
                                // (refer to findUser._id above)
                                const userId = prompt('ID:');
                                if (
                                    userId &&
                                    userId.length > 0 &&
                                    userId.length < 16
                                ) {
                                    const updatedFriends = this.state.friends;
                                    let newId = `*${userId}`;
                                    let found = false;
                                    for (
                                        let i = 0;
                                        i < updatedFriends.length;
                                        i++
                                    ) {
                                        if (updatedFriends[i]._id === newId) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        updatedFriends.push({
                                            _id: newId,
                                            name: `ID: ${userId}`,
                                        });
                                        this.setState({
                                            friends: updatedFriends,
                                        });
                                    }
                                    return newId;
                                } else {
                                    // signify cancel so the UI will revert the selection
                                    return null;
                                }
                            }
                            return val;
                        }
                    )}
                    {this.renderButton('Create')}
                </form>
                <div style={{ height: 20 }} />
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-warning">
                        {this.state.message}
                    </div>
                )}
            </>
        );
    }
}

export default Create;
