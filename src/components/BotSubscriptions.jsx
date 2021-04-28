import { Component } from 'react';
import {
    getAllBots,
    getMyBots,
    removeBot,
    addBot,
} from '../services/botsService';
import Icon from './common/icon';

class BotSubscriptions extends Component {
    state = {
        bots: [],
        error: '',
    };

    async componentDidMount() {
        try {
            const response = await getAllBots();
            const newState = { bots: response.data, error: '' };
            for (const bot of response.data) {
                newState[bot._id] = false;
            }
            const response2 = await getMyBots();
            for (const bot of response2.data) {
                newState[bot._id] = true;
            }
            this.setState(newState);
        } catch (error) {
            this.setState({
                error: error.message + ', ' + error.response.data,
            });
        }
    }

    async handleToggle(bot) {
        const checked = this.state[bot._id];
        try {
            if (checked) {
                await removeBot({ botId: bot._id });
                const newState = { error: '' };
                newState[bot._id] = false;
                this.setState(newState);
            } else {
                await addBot({ botId: bot._id });
                const newState = { error: '' };
                newState[bot._id] = true;
                this.setState(newState);
            }
        } catch (error) {
            this.setState({
                error: error.message + ', ' + error.response.data,
            });
        }
    }

    render() {
        return (
            <>
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                >
                    Subscribe to Puzzle Bots
                </div>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.bots.map((bot, idx) => (
                    <div key={bot._id}>
                        <div>
                            <hr />
                            <input
                                type="checkbox"
                                checked={this.state[bot._id]}
                                onChange={() => {
                                    this.handleToggle(bot);
                                }}
                                id={`botsub${idx}`}
                                style={{ height: 20, width: 20 }}
                            />
                            <span style={{ marginLeft: 40 }}>
                                <label htmlFor={`botsub${idx}`}>
                                    <Icon
                                        name={bot.icon}
                                        backgroundColor={bot.color}
                                        size={40}
                                        margin={20}
                                    ></Icon>
                                    {bot.name}
                                </label>
                            </span>
                        </div>
                    </div>
                ))}
            </>
        );
    }
}

export default BotSubscriptions;
