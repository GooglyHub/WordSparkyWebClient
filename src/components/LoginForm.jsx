import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import { login, getCurrentUser } from '../services/authService';

class LoginForm extends Form {
    state = {
        data: {
            displayName: '',
            password: '',
        },
        errors: {},
        error: null,
    };

    schema = {
        displayName: Joi.string().required().label('Display name'),
        password: Joi.string().required().label('Password'),
    };

    doSubmit = async () => {
        try {
            const { displayName, password } = this.state.data;
            await login(displayName, password);
            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/';
        } catch (ex) {
            let msg = 'Error logging in';
            if (ex.response && ex.response.data) {
                msg = ex.response.data;
            }
            this.setState({ error: msg });
        }
    };

    render() {
        if (getCurrentUser()) {
            return <Redirect to="/"></Redirect>;
        }
        return (
            <>
                <div
                    style={{
                        width: 300,
                        padding: 10,
                    }}
                >
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput('displayName', 'Display name')}
                        {this.renderInput('password', 'Password', 'password')}
                        {this.renderButton('Login')}
                    </form>
                </div>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
            </>
        );
    }
}

export default LoginForm;
