import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import { login, getCurrentUser } from '../services/authService';

class LoginForm extends Form {
    state = {
        data: {
            username: '',
            password: '',
        },
        errors: {},
        error: null,
    };

    schema = {
        username: Joi.string().required().label('Username'),
        password: Joi.string().required().label('Password'),
    };

    doSubmit = async () => {
        try {
            const { username, password } = this.state.data;
            const error = await login(username, password);
            if (error) {
                this.setState({ error });
            } else {
                const { state } = this.props.location;
                window.location = state ? state.from.pathname : '/';
            }
        } catch (ex) {
            let msg = 'Error logging in';
            if (ex.response && ex.response.data && ex.response.data.error) {
                msg = ex.response.data.error;
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
                        {this.renderInput('username', 'Username')}
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
