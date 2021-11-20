import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { changePassword } from '../services/usersService';
import utils from './../common/utils';

class ChangePassword extends Form {
    state = {
        verCode: '',
        errors: {},
        error: null,
    };

    genCode = async () => {
        try {
            const password = utils.generateVerificationCode();
            const resp = await changePassword({ password });
            this.setState({ error: null, verCode: password });
        } catch (error) {
            let errorMsg = 'Error generating verification code';
            if (error.response && error.response.data) {
                errorMsg = error.response.data;
            }
            this.setState({ error: errorMsg, verCode: '' });
        }
    };

    render() {
        return (
            <>
                <div
                    style={{
                        width: 600,
                        padding: 10,
                    }}
                >
                    <p>
                        If you play Word Sparky on this device only, then you
                        may skip this page.
                    </p>
                    <p>
                        Using the ID and verification code below, you can log in
                        and play Word Sparky with this account on other devices.
                    </p>
                    <p
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: 10,
                        }}
                    >{`ID: ${this.props.user.id}`}</p>
                    <p
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: 10,
                        }}
                    >{`Verification Code: ${this.state.verCode}`}</p>
                    <button className="btn btn-warning" onClick={this.genCode}>
                        Generate Code
                    </button>
                </div>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
            </>
        );
    }
}

export default ChangePassword;
