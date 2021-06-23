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
            displayName: this.props.user.displayName,
            icon: this.props.user.icon || 'account',
            color: this.props.user.color || 'blue',
        },
        errors: {},
        error: '',
        message: '',
    };

    schema = {
        displayName: Joi.string().required().min(3).max(16).label('Name'),
        icon: Joi.string().required(),
        color: Joi.string().required(),
    };

    doSubmit = async () => {
        try {
            const { displayName, icon, color } = this.state.data;
            const response = await updateProfile({
                icon,
                color,
            });
            this.setState({
                data: {
                    displayName,
                    icon,
                    color,
                },
                error: '',
                message: 'Profile has been updated',
            });
            loginWithToken(response.data);
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
                    {this.renderInput('displayName', 'Name', 'text', true)}
                    {this.renderSelect('icon', 'Icon', icons, 'label')}
                    {this.renderSelect('color', 'Color', colors, 'color')}

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
                    <div className="alert alert-success">
                        {this.state.message}
                    </div>
                )}
            </>
        );
    }
}

export default Profile;
