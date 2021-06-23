import {
    getFriends,
    removeFriend,
    addFriend,
    getFriendRequests,
} from '../services/friendsService';
import Form from './common/form';
import Joi from 'joi-browser';
import Icon from './common/icon';

class Friends extends Form {
    state = {
        friends: [],
        friendRequests: [],
        data: {
            friendSearch: '',
        },
        errors: {},
        error: '',
        message: '',
    };

    schema = {
        friendSearch: Joi.string().required().label('Search for friend'),
    };

    async componentDidMount() {
        try {
            const response = await getFriends();
            const response2 = await getFriendRequests();
            const newState = {
                friends: response.data,
                friendRequests: response2.data,
            };
            this.setState(newState);
        } catch (error) {
            this.setState({
                error: error.message + ', ' + error.response.data,
                message: '',
            });
        }
    }

    doSubmit = async () => {
        try {
            const response = await addFriend({
                name: this.state.data.friendSearch,
            });
            this.setState({
                error: '',
                message: `You are now friends with ${this.state.data.friendSearch}`,
            });
            const newFriendRequests = this.state.friendRequests.filter(
                (fr) => fr.displayName !== this.state.data.friendSearch
            );
            this.setState({ friendRequests: newFriendRequests });

            let newFriends = [...this.state.friends];
            newFriends.push(response.data);
            this.setState({ friends: newFriends });
        } catch (error) {
            this.setState({
                error: error.response.data, // intentionally omitting error.message since
                // a 404 can be returned for normal flows
                message: '',
            });
        }
    };

    handleRemove = async (friend) => {
        if (
            window.confirm(
                `Are you sure you want to remove ${friend.displayName} as a friend?`
            )
        ) {
            try {
                await removeFriend({
                    _id: friend._id,
                });
                const newFriendRequests = this.state.friendRequests.filter(
                    (fr) => fr._id !== friend._id
                );
                this.setState({ friendRequests: newFriendRequests });

                let newFriends = this.state.friends.filter(
                    (fr) => fr._id !== friend._id
                );
                this.setState({ friends: newFriends });
            } catch (error) {
                this.setState({
                    error: error.message + ', ' + error.response.data,
                    message: '',
                });
            }
        }
    };

    handleAccept = async (friend) => {
        try {
            const response = await addFriend({
                name: friend.displayName,
            });
            this.setState({
                error: '',
                message: `You are now friends with ${friend.displayName}`,
            });
            const newFriendRequests = this.state.friendRequests.filter(
                (fr) => fr._id !== friend._id
            );
            this.setState({ friendRequests: newFriendRequests });

            let newFriends = [...this.state.friends];
            newFriends.push(response.data);
            this.setState({ friends: newFriends });
        } catch (error) {
            this.setState({
                error: error.message + ', ' + error.response.data,
                message: '',
            });
        }
    };

    render() {
        return (
            <>
                <hr></hr>
                {this.state.error && (
                    <div className="alert alert-danger">{this.state.error}</div>
                )}
                {this.state.message && (
                    <div className="alert alert-success">
                        {this.state.message}
                    </div>
                )}
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    {this.renderInput('friendSearch', 'Search for user to add')}
                    {this.renderButton('Add Friend')}
                </form>
                {this.state.friends.length > 0 && (
                    <>
                        <hr></hr>
                        <h3>Friends</h3>
                        {this.state.friends.map((friend) => (
                            <div
                                key={friend._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        margin: 10,
                                    }}
                                >
                                    <Icon
                                        name={friend.icon || 'account'}
                                        backgroundColor={friend.color || 'blue'}
                                        size={40}
                                    ></Icon>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            alignSelf: 'center',
                                            marginLeft: 10,
                                        }}
                                    >
                                        {friend.displayName}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        style={{
                                            marginTop: 15,
                                            marginBottom: 15,
                                        }}
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            this.handleRemove(friend);
                                        }}
                                    >
                                        <span className="mdi mdi-account-minus">
                                            Remove
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {this.state.friendRequests.length > 0 && (
                    <>
                        <hr></hr>
                        <h3>Incoming Friend Requests</h3>
                        {this.state.friendRequests.map((friend) => (
                            <div
                                key={friend._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        margin: 10,
                                    }}
                                >
                                    <Icon
                                        name={friend.icon || 'account'}
                                        backgroundColor={friend.color || 'blue'}
                                        size={40}
                                    ></Icon>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            alignSelf: 'center',
                                            marginLeft: 10,
                                        }}
                                    >
                                        {friend.displayName}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        style={{
                                            marginTop: 15,
                                            marginBottom: 15,
                                        }}
                                        className="btn btn-sm btn-warning"
                                        onClick={() => {
                                            this.handleAccept(friend);
                                        }}
                                    >
                                        <span className="mdi mdi-account-plus">
                                            Accept
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </>
        );
    }
}

export default Friends;
