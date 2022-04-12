import React, { Component } from 'react';

class NoPuzzlesCard extends Component {
    render() {
        return (
            <div
                style={{
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                You have no more puzzles to solve!
                <div
                    style={{
                        paddingTop: 10,
                        alignSelf: 'flex-start',
                    }}
                >
                    <button
                        className="btn btn-primary"
                        onClick={this.props.onClick}
                    >
                        Give me a random bot puzzle
                    </button>
                </div>
            </div>
        );
    }
}

export default NoPuzzlesCard;
