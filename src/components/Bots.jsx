import React from 'react';
import Joi from 'joi-browser';
import {
    getBots,
    updateBotPuzzle,
    getHeadlines,
} from '../services/botsService';
import Form from './common/form';

const hints = [
    { value: 'I CANNOT BELIEVE THAT ...', _id: '1' },
    { value: "I DIDN'T KNOW THAT ...", _id: '2' },
    { value: 'TODAY ... ', _id: '3' },
    { value: 'BREAKING NEWS ... ', _id: '4' },
];

class Bots extends Form {
    state = {
        bots: [],
        data: {},
        suggestions: [],
        errors: {},
    };

    schema = {};

    async componentDidMount() {
        try {
            const response = await getBots();
            const newBots = response.data;
            const n = newBots.length;
            const newData = {};
            const newSuggestions = [];
            for (let i = 0; i < n; ++i) {
                newData[`hint${i}`] = '1';
                newData[`answer${i}`] = '';
                newSuggestions.push([]);
            }

            this.setState({
                bots: newBots,
                data: newData,
                suggestions: newSuggestions,
            });
            const newSchema = {};
            for (let i = 0; i < n; ++i) {
                newSchema[`hint${i}`] = Joi.string().min(1).label('Hint');
                newSchema[`answer${i}`] = Joi.string()
                    .regex(/(?=.*[A-Za-z])^[-A-Za-z0-9.,?!'" ]+$/, 'answer')
                    .min(1)
                    .max(128)
                    .label('Answer');
            }
            this.schema = newSchema;
        } catch (ex) {
            console.log(ex);
            if (ex.response) {
                this.setState({
                    error: ex.response.data,
                });
            } else {
                this.setState({
                    error: 'Error fetching games',
                });
            }
        }
    }

    doSubmit = async () => {
        try {
            for (let i = 0; i < this.state.bots.length; i++) {
                const answer = this.state.data[`answer${i}`]
                    .trim()
                    .toUpperCase();
                let hint = '';
                for (const obj of hints) {
                    if (obj._id === this.state.data[`hint${i}`]) {
                        hint = obj.value;
                    }
                }
                await updateBotPuzzle({
                    botId: this.state.bots[i]._id,
                    hint,
                    answer,
                });
            }
            alert('Bot puzzles have been updated');
        } catch (ex) {
            if (ex.response) {
                alert(ex.response.data);
            } else {
                alert('Error creating game');
            }
        }
    };

    handleCopyHeadline = (botIdx, headlineIdx) => {
        const newData = { ...this.state.data };
        newData[`answer${botIdx}`] = this.state.suggestions[botIdx][
            headlineIdx
        ];
        this.setState({ data: newData });
    };

    handleGetHeadlines = async () => {
        const n = this.state.bots.length;
        const categories = this.state.bots.map((bot) => bot.category);
        const headlines = await getHeadlines(categories);
        const newData = { ...this.state.data };
        for (let i = 0; i < n; i++) {
            if (headlines[i].length > 0) {
                newData[`answer${i}`] = headlines[i][0];
            }
        }
        this.setState({ suggestions: headlines, data: newData });
    };

    render() {
        return (
            <>
                <button
                    className="btn-primary"
                    type="button"
                    onClick={this.handleGetHeadlines}
                >
                    Get Headlines
                </button>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    {this.state.bots.map((bot, idx) => (
                        <div
                            key={idx}
                            style={{
                                border: '2px solid black',
                                borderRadius: '10px',
                                padding: '10px',
                                margin: '10px',
                            }}
                        >
                            <h3>{bot.name}</h3>
                            {this.renderSelect(
                                `hint${idx}`,
                                'Hint',
                                hints,
                                'value'
                            )}
                            {this.renderInput(`answer${idx}`, 'Answer')}
                            <ul>
                                {this.state.suggestions[idx].map(
                                    (headline, idx2) => (
                                        <li key={idx2}>
                                            <input
                                                key={idx2}
                                                type="text"
                                                value={headline}
                                                size={128}
                                                readOnly
                                            />
                                            <button
                                                className="btn-primary btn-small"
                                                type="button"
                                                onClick={() =>
                                                    this.handleCopyHeadline(
                                                        idx,
                                                        idx2
                                                    )
                                                }
                                            >
                                                Copy
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ))}
                    {this.renderButton('Submit')}
                </form>
            </>
        );
    }
}

export default Bots;
