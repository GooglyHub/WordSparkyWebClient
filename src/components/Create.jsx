import React from 'react';
import Joi from 'joi-browser';
import { getFriends } from '../services/friendsService';
import {
    addGame,
    addGameForBot,
    addGameForBotAsGuest,
} from '../services/gamesService';
import { coinEarned } from '../services/coinsService';
import Form from './common/form';
import { getCurrentUser } from '../services/authService';

const hints = [
    { value: 'I CANNOT BELIEVE THAT ...', _id: '1' },
    { value: "I DIDN'T KNOW THAT ...", _id: '2' },
    { value: 'TODAY ... ', _id: '3' },
    { value: 'PLEASE TELL ME ...', _id: '4' },
    { value: 'I PLAN TO ...', _id: '5' },
    { value: 'I PREDICT ...', _id: '6' },
    { value: 'I FORGOT ...', _id: '7' },
    { value: "I'M GLAD ...", _id: '8' },
    { value: 'I MISS ...', _id: '9' },
    { value: 'I WANT ...', _id: '10' },
    { value: 'I WONDER ...', _id: '11' },
    { value: 'CONFESSION', _id: '12' },
];

class Create extends Form {
    state = {
        friends: [],
        coins: 0,
        data: {
            hint: '1',
            answer: '',
            solver: getCurrentUser() ? '' : '-1',
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
        const user = getCurrentUser();
        const sparkyBot = {
            _id: -1,
            displayName: 'Sparky Bot',
        };
        if (user) {
            try {
                const response = await getFriends();
                this.setState({
                    friends: [...response.data, sparkyBot],
                });
            } catch (ex) {
                console.log(ex);
            }
        } else {
            this.setState({
                friends: [sparkyBot],
            });
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
                const user = getCurrentUser();
                if (user) {
                    await addGameForBot(game);
                } else {
                    await addGameForBotAsGuest(game);
                }
            } else {
                await addGame(game);

                try {
                    await coinEarned();
                } catch (error) {
                    // Over daily limit? Not fatal
                }
            }
            this.setState({
                data: {
                    hint: '1',
                    answer: '',
                    solver: getCurrentUser() ? '' : '-1',
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
        const user = getCurrentUser();
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
                        'displayName',
                        user ? true : false
                    )}
                    {!user && this.state.friends.length <= 1 && (
                        <div className="alert alert-warning">
                            Tip: Guests can only send puzzles to Sparky Bot.
                            Registered users can send puzzles to friends as
                            well.
                        </div>
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
