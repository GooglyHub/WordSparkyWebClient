import React from 'react';
import Joi from 'joi-browser';
import { getAllBots, updateBotPuzzle } from '../services/botsService';
import Form from './common/form';

class Bots extends Form {
    state = {
        bots: [],
        data: {},
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
            for (let i = 0; i < n; ++i) {
                newData[`answer${i}`] = '';
            }

            this.setState({
                bots: newBots,
                data: newData,
            });
            const newSchema = {};
            for (let i = 0; i < n; ++i) {
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
                await updateBotPuzzle({
                    botId: this.state.bots[i]._id,
                    answer,
                });
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

    render() {
        return (
            <>
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
                            <span>{bot.hint}</span>
                            {this.renderInput(`answer${idx}`, '')}
                        </div>
                    ))}
                </form>
            </>
        );
    }
}

export default Bots;
