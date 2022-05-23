import React from 'react';
import Joi from 'joi-browser';
import {
    getAllBots,
    updateBotPuzzle,
    getHeadlines,
} from '../services/botsService';
import Form from './common/form';

class Bots extends Form {
    state = {
        bots: [],
        data: {},
        suggestions: [],
        errors: {},
        error: '',
        message: '',
    };

    schema = {};

    async componentDidMount() {
        try {
            const response = await getAllBots();
            const newBots = response.data;
            const n = newBots.length;
            const newData = {};
            const newSuggestions = [];
            for (let i = 0; i < n; ++i) {
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
                newSchema[`answer${i}`] = Joi.string()
                    .regex(/^[-A-Za-z0-9.,?!'"$ ]*$/, 'answer')
                    .allow('')
                    .max(100)
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
                if (answer.length > 0) {
                    await updateBotPuzzle({
                        botId: this.state.bots[i]._id,
                        answer,
                    });
                }
            }
            this.setState({
                error: '',
                message: 'Bot puzzles have been updated',
            });
        } catch (ex) {
            if (ex.response) {
                this.setState({
                    error: ex.response.data,
                    message: '',
                });
            } else {
                this.setState({
                    error: 'Error updating bot puzzles',
                    message: '',
                });
            }
        }
    };

    handleCopyHeadline = (botIdx, headlineIdx) => {
        const newData = { ...this.state.data };
        newData[`answer${botIdx}`] =
            this.state.suggestions[botIdx][headlineIdx];
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
                    {this.renderButton('Submit')}
                    {this.state.error && (
                        <div className="alert alert-danger">
                            {this.state.error}
                        </div>
                    )}
                    {this.state.message && (
                        <div className="alert alert-warning">
                            {this.state.message}
                        </div>
                    )}
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
                            {this.renderInput(`answer${idx}`, '')}
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
                </form>
            </>
        );
    }
}

export default Bots;
