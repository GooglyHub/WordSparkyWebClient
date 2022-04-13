import Form from './common/form';
import Joi from 'joi-browser';
import icons from '../common/icons';
import colors from '../common/colors';
import { updateProfile } from '../services/usersService';
import { loginWithToken } from '../services/authService';
import Icon from './common/icon';

class Profile extends Form {
    state = {
        data: {
            name: this.props.user.username,
            icon: this.props.user.icon,
            color: this.props.user.color,
        },
        errors: {},
        error: '',
        message: '',
    };

    schema = {
        name: Joi.string().required().min(1).max(16).label('Name'),
        icon: Joi.string().required(),
        color: Joi.string().required(),
    };

    doSubmit = async () => {
        try {
            const { name, icon, color } = this.state.data;
            const response = await updateProfile({
                name: this.props.user.username !== name ? name : undefined,
                icon: this.props.user.icon !== icon ? icon : undefined,
                color: this.props.user.color !== color ? color : undefined,
            });
            this.setState({
                data: {
                    name,
                    icon,
                    color,
                },
                error: '',
                message: 'Profile has been updated',
            });
            loginWithToken(response.data.token);
            window.location = '/';
        } catch (error) {
            if (error.response) {
                this.setState({
                    error: error.message + ', ' + error.response.data,
                    message: '',
                });
            } else {
                this.setState({
                    error: 'Error updating profile',
                    message: '',
                });
            }
        }
    };

    render() {
        return (
            <>
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 5,
                    }}
                >
                    Update Profile
                </div>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'Name', 'text', true)}
                    {this.renderSelect('icon', 'Icon', icons, 'label', false)}
                    {this.renderSelect(
                        'color',
                        'Color',
                        colors,
                        'color',
                        false
                    )}

                    <div style={{ marginBottom: 20 }}>
                        Preview:
                        <Icon
                            name={this.state.data.icon}
                            backgroundColor={this.state.data.color}
                            size={40}
                            margin={20}
                        ></Icon>
                    </div>
                    {this.renderButton('Update')}
                </form>
                <div style={{ height: 20 }} />
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

export default Profile;
