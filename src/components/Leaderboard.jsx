import React, { Component } from 'react';
import { getLeaderboard } from '../services/leaderboardService';
import LeaderboardTable from './LeaderboardTable';

class Leaderboard extends Component {
    state = {
        data: [],
        error: null,
    };

    async componentDidMount() {
        try {
            const response = await getLeaderboard();
            this.setState({
                data: response.data,
                error: null,
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response) {
                this.setState({ data: [], error: ex.response.data });
            } else {
                this.setState({
                    data: [],
                    error: 'Error fetching leaderboard',
                });
            }
        }
    }

    render() {
        return (
            <>
                <div style={{ marginLeft: 20, marginRight: 20 }}>
                    {this.state.error && <span>{this.state.error}</span>}
                </div>
                {this.state.data.map((item) => (
                    <LeaderboardTable
                        key={item.id}
                        title={item.title}
                        tableData={item.tableData}
                    />
                ))}
            </>
        );
    }
}

export default Leaderboard;
