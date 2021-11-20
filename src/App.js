import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import Games from './components/Games';
import Create from './components/Create';
import Leaderboard from './components/Leaderboard';
import Account from './components/Account';
import Help from './components/Help';
import { getCurrentUser, getJwt, loginWithToken } from './services/authService';
import ProtectedRoute from './components/common/protectedRoute';
import ProtectedAdminRoute from './components/common/protectedAdminRoute';
import Bots from './components/Bots';
import { checkToken } from './services/usersService';
import './App.css';
import jwtDecode from 'jwt-decode';

function App() {
    const [currUser, setCurrUser] = useState(getCurrentUser());

    useEffect(() => {
        // Check the server if the auth token needs to be updated
        async function f() {
            try {
                let token = getJwt();
                if (token) {
                    const resp = await checkToken(token);
                    if (
                        resp &&
                        resp.data &&
                        resp.data.valid &&
                        resp.data.token
                    ) {
                        if (resp.data.token !== token) {
                            token = resp.data.token;
                            loginWithToken(token);
                        }
                    }
                    const user = jwtDecode(token);
                    setCurrUser(user);
                }
            } catch (ex) {}
        }
        f();
    }, []);

    return (
        <>
            <NavBar user={currUser}></NavBar>
            <main className="my-container">
                <Switch>
                    <Route path="/login" component={LoginForm}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route
                        path="/home"
                        render={() => <Games user={currUser}></Games>}
                    ></Route>
                    <Route path="/create" component={Create}></Route>
                    <ProtectedRoute
                        path="/leaderboard"
                        component={Leaderboard}
                    ></ProtectedRoute>
                    <ProtectedRoute
                        path="/account"
                        render={() => <Account user={currUser}></Account>}
                    ></ProtectedRoute>
                    <Route path="/help" component={Help}></Route>
                    <ProtectedAdminRoute
                        path="/bots"
                        component={Bots}
                    ></ProtectedAdminRoute>
                    <Route path="/not-found" component={NotFound}></Route>
                    <Redirect
                        from="/"
                        exact
                        to={currUser ? '/home' : '/login'}
                    ></Redirect>
                    <Redirect to="/not-found"></Redirect>
                </Switch>
            </main>
        </>
    );
}

export default App;
