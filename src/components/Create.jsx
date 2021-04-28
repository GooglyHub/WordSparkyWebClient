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
            hint: '',
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
        try {
            const response = await getFriends();
            this.setState({
                friends: [
                    ...response.data,
                    {
                        _id: -1,
                        displayName: 'Sparky Bot',
                    },
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
            if (solver === '-1') {
                delete game.solverId;
            }
            await addGame(game);
            this.setState({
                data: {
                    hint: undefined,
                    answer: '',
                    solver: undefined,
                },
                error: '',
                message: 'Puzzle has been created',
            });
            const elements = document.getElementsByTagName('select');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].selectedIndex = 0;
            }
        } catch (error) {
            this.setState({
                error: error.message + ', ' + error.response.data,
                message: '',
            });
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
                    {this.renderSelect('hint', 'Hint', hints, 'value')}
                    {this.renderInput('answer', 'Answer')}
                    {this.renderSelect(
                        'solver',
                        'Send to',
                        this.state.friends,
                        'displayName'
                    )}
                    {this.state.friends.length <= 1 && (
                        <div className="alert alert-success">
                            For now, you can only send puzzles to Sparky Bot.
                            Add some friends to be able to send puzzles to real
                            people.
                        </div>
                    )}
                    {this.renderButton('Create')}
                </form>
                <div style={{ height: 20 }} />
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-success">
                        {this.state.message}
                    </div>
                )}
            </>
        );
    }
}

export default Create;
