import React, { Component } from 'react';
import AccountNavBar from './AccountNavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from './NotFound';
import ProtectedRoute from './common/protectedRoute';
import Logout from './Logout';
import Profile from './Profile';
import BotSubscriptions from './BotSubscriptions';
import Friends from './Friends';

class Account extends Component {
    render() {
        return (
            <>
                <AccountNavBar />
                <main className="my-container">
                    <Switch>
                        <Route path="/logout" component={Logout}></Route>
                        <ProtectedRoute
                            path="/account/profile"
                            render={() => (
                                <Profile user={this.props.user}></Profile>
                            )}
                        ></ProtectedRoute>
                        <ProtectedRoute
                            path="/account/bots"
                            render={() => (
                                <BotSubscriptions
                                    user={this.props.user}
                                ></BotSubscriptions>
                            )}
                        ></ProtectedRoute>
                        <ProtectedRoute
                            path="/account/friends"
                            render={() => (
                                <Friends user={this.props.user}></Friends>
                            )}
                        ></ProtectedRoute>
                        <Route path="/not-found" component={NotFound}></Route>
                        <Redirect
                            from="/account"
                            exact
                            to="/account/profile"
                        ></Redirect>
                        <Redirect to="/not-found"></Redirect>
                    </Switch>
                </main>
            </>
        );
    }
}

export default Account;
