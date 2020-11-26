import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import { login, getCurrentUser } from '../services/authService';

class LoginForm extends Form {
    state = {
        data: {
            email: '',
            password: '',
        },
        errors: {},
    };

    schema = {
        email: Joi.string().required().email().label('Email'),
        password: Joi.string().required().label('Password'),
    };

    doSubmit = async () => {
        try {
            const { email, password } = this.state.data;
            await login(email, password);
            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/';
        } catch (ex) {
            const errors = { ...this.state.errors };
            if (ex.response) {
                errors.password = ex.response.data;
            } else {
                errors.password = 'Error logging in';
            }
            this.setState({ errors });
        }
    };

    render() {
        if (getCurrentUser()) {
            return <Redirect to="/"></Redirect>;
        }
        return (
            <div
                style={{
                    width: 300,
                    padding: 10,
                }}
            >
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', 'password')}
                    {this.renderButton('Login')}
                </form>
            </div>
        );
    }
}

export default LoginForm;
