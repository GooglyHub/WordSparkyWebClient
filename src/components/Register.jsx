import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import { register } from '../services/usersService';
import { loginWithToken } from '../services/authService';

class Register extends Form {
    state = {
        data: {
            email: '',
            password: '',
            displayName: '',
        },
        errors: {},
    };

    schema = {
        email: Joi.string().required().email().min(1).max(256).label('Email'),
        password: Joi.string().required().min(1).max(256).label('Password'),
        displayName: Joi.string()
            .required()
            .min(3)
            .max(16)
            .label('Display name'),
    };

    doSubmit = async () => {
        try {
            const { email, password, displayName } = this.state.data;
            const response = await register({ email, password, displayName });
            const authToken = response.data;
            loginWithToken(authToken);
            window.location = '/';
        } catch (ex) {
            const errors = { ...this.state.errors };
            if (ex.response) {
                errors.password = ex.response.data;
            } else {
                errors.password = 'Error registering';
            }
            this.setState({ errors });
        }
    };

    render() {
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
                    {this.renderInput('displayName', 'Display name')}
                    {this.renderButton('Register')}
                </form>
            </div>
        );
    }
}

export default Register;
