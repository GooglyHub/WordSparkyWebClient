import React, { Component } from 'react';
import AccountNavBar from './AccountNavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from './NotFound';
import ProtectedRoute from './common/protectedRoute';
import Logout from './Logout';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

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
                            path="/account/vercode"
                            render={() => (
                                <ChangePassword
                                    user={this.props.user}
                                ></ChangePassword>
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
