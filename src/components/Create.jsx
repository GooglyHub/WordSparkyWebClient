import React from 'react';
import Joi from 'joi-browser';
import { getFriends } from '../services/friendsService';
import { addGame } from '../services/gamesService';
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
    { value: 'CONFESSION ...', _id: '10' },
];

class Create extends Form {
    state = {
        friends: [],
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
            .regex(/(?=.*[A-Za-z])^[-A-Za-z0-9.,?!'"$ ]+$/, 'answer')
            .min(1)
            .max(100)
            .label('Answer'),
        solver: Joi.string().min(1).label('Solver'),
    };

    async componentDidMount() {
        const findUser = {
            _id: '*',
            name: 'Find Username...',
        };
        try {
            const response = await getFriends();
            this.setState({
                friends: [
                    findUser,
                    ...response.data.map((friend) => ({
                        _id: friend._id,
                        name: friend.username,
                    })),
                ],
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
            if (solver[0] === '*') {
                if (solver.length <= 1) {
                    return;
                }
                delete game.solverId;
                game['solverName'] = solver.substring(1);
            }
            await addGame(game);
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
                    {this.renderInput('answer', 'Answer', 'text', false, true)}
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
                                const username = prompt('Username:');
                                if (
                                    username &&
                                    username.length > 0 &&
                                    username.length <= 16
                                ) {
                                    const updatedFriends = this.state.friends;
                                    let newId = `*${username}`;
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
                                            name: username,
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
