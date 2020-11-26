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
            hint: undefined,
            answer: '',
            solver: undefined,
        },
        errors: {},
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
            const newState = { ...this.state };
            newState.friends = response.data;
            this.setState(newState);
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
            await addGame({
                answer: answer.toUpperCase(),
                hint: hintString.toUpperCase(),
                solverId: solver,
            });
            // setCoins(coins + 1);
            alert('Puzzle has been created');
            const newState = { ...this.state };
            newState.data = {
                hint: undefined,
                answer: '',
                solver: undefined,
            };
            this.setState(newState);
            const elements = document.getElementsByTagName('select');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].selectedIndex = 0;
            }
        } catch (ex) {
            if (ex.response) {
                alert(ex.response.data);
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
                <form autocomplete="off" onSubmit={this.handleSubmit}>
                    {this.renderSelect('hint', 'Hint', hints, 'value')}
                    {this.renderInput('answer', 'Answer')}
                    {this.renderSelect(
                        'solver',
                        'Send to',
                        this.state.friends,
                        'displayName'
                    )}
                    {this.renderButton('Create')}
                </form>
            </>
        );
    }
}

export default Create;
