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
import Register from './components/Register';
import './App.css';

function App() {
    return (
        <>
            <NavBar user={getCurrentUser()}></NavBar>
            <main className="my-container">
                <Switch>
                    <Route path="/login" component={LoginForm}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route path="/register" component={Register}></Route>
                    <ProtectedRoute
                        path="/home"
                        component={Games}
                    ></ProtectedRoute>
                    <ProtectedRoute
                        path="/create"
                        component={Create}
                    ></ProtectedRoute>
                    <ProtectedRoute
                        path="/leaderboard"
                        component={Leaderboard}
                    ></ProtectedRoute>
                    <ProtectedRoute
                        path="/account"
                        component={Account}
                    ></ProtectedRoute>
                    <Route path="/not-found" component={NotFound}></Route>
                    <Redirect from="/" exact to="/home"></Redirect>
                    <Redirect to="/not-found"></Redirect>
                </Switch>
            </main>
        </>
    );
}

export default App;
