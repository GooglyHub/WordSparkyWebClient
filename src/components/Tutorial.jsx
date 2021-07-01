import React, { Component } from 'react';

class Tutorial extends Component {

    render() {
        return (
            <div>
                <h1>How to Play</h1>
                <video width="320" height="240" controls>
                    <source src="http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }
}

export default Tutorial;
