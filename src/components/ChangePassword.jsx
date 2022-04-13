import React from 'react';
import Form from './common/form';
import Joi from 'joi-browser';
import { changePassword } from '../services/usersService';

class ChangePassword extends Form {
    state = {
        data: {
            username: this.props.user.username,
            password: '',
        },
        errors: {},
        error: null,
        message: null,
    };

    schema = {
        username: Joi.string().label('Username'),
        password: Joi.string().required().min(1).max(256).label('Password'),
    };

    doSubmit = async () => {
        try {
            const { password } = this.state.data;
            const resp = await changePassword({ password });
            if (resp.status === 200) {
                this.setState({ error: null, message: 'Password updated' });
            } else {
                this.setState({
                    error: resp.data,
                    message: null,
                });
            }
        } catch (error) {
            let errorMsg = 'Error changing password';
            if (error.response && error.response.data) {
                errorMsg = error.response.data;
            }
            this.setState({ error: errorMsg, message: null });
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
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput('username', 'Username', 'text', true)}
                        {this.renderInput(
                            'password',
                            'New password',
                            'password'
                        )}
                        {this.renderButton('Update')}
                    </form>
                </div>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-warning">
                        {this.state.message}
                    </div>
                )}
            </>
        );
    }
}

export default ChangePassword;
