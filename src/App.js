import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import Games from './components/Games';
import Create from './components/Create';
import Leaderboard from './components/Leaderboard';
import Account from './components/Account';
import { getCurrentUser } from './services/authService';
import ProtectedRoute from './components/common/protectedRoute';
import ProtectedAdminRoute from './components/common/protectedAdminRoute';
import Register from './components/Register';
import Bots from './components/Bots';
import './App.css';

function App() {
    const currUser = getCurrentUser();
    return (
        <>
            <NavBar user={currUser}></NavBar>
            <main className="my-container">
                <Switch>
                    <Route path="/login" component={LoginForm}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route path="/register" component={Register}></Route>
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
                    <ProtectedAdminRoute
                        path="/bots"
                        component={Bots}
                    ></ProtectedAdminRoute>
                    <Route path="/not-found" component={NotFound}></Route>
                    <Redirect from="/" exact to="/home"></Redirect>
                    <Redirect to="/not-found"></Redirect>
                </Switch>
            </main>
        </>
    );
}

export default App;
