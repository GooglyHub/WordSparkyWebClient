import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import { login, getCurrentUser } from '../services/authService';

class LoginForm extends Form {
    state = {
        data: {
            id: '',
            verCode: '',
        },
        errors: {},
        error: null,
    };

    schema = {
        id: Joi.string().required().label('ID'),
        verCode: Joi.string().required().label('Verification Code'),
    };

    doSubmit = async () => {
        try {
            const { id, verCode } = this.state.data;
            await login(id, verCode);
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
                        {this.renderInput('id', 'ID')}
                        {this.renderInput('verCode', 'Verification Code')}
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
