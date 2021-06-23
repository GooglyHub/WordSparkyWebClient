import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { register } from '../services/usersService';
import { loginWithToken } from '../services/authService';

class Register extends Form {
    state = {
        data: {
            displayName: '',
            password: '',
        },
        errors: {},
        error: null,
    };

    schema = {
        displayName: Joi.string()
            .required()
            .min(3)
            .max(16)
            .regex(/^[A-Za-z0-9]+$/, 'letters and digits only')
            .label('Display name'),
        password: Joi.string().required().min(1).max(256).label('Password'),
    };

    doSubmit = async () => {
        try {
            const { displayName, password } = this.state.data;
            const response = await register({ displayName, password });
            const authToken = response.data;
            loginWithToken(authToken);
            window.location = '/';
        } catch (ex) {
            let msg = 'Error registering';
            if (ex.response && ex.response.data) {
                msg = ex.response.data;
            }
            this.setState({ error: msg });
        }
    };

    render() {
        return (
            <>
                <div
                    style={{
                        width: 400,
                        padding: 10,
                    }}
                >
                    <div className="alert alert-success">
                        Display name is the name that other users see you as. It
                        must be between 3 and 16 letters or digits. <br />
                        Word Sparky is also available as an Android app.
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput('displayName', 'Display name')}
                        {this.renderInput('password', 'Password', 'password')}
                        {this.renderButton('Register')}
                    </form>
                </div>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
            </>
        );
    }
}

export default Register;
