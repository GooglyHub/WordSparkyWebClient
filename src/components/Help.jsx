import React, { Component } from 'react';
import HelpNavBar from './HelpNavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from './NotFound';
import Privacy from './Privacy';
import Tutorial from './Tutorial';
import Credits from './Credits';

class Help extends Component {
    render() {
        return (
            <>
                <HelpNavBar />
                <main className="my-container">
                    <Switch>
                        <Route path="/help/privacy" component={Privacy}></Route>
                        <Route path="/help/tutorial" component={Tutorial}></Route>
                        <Route path="/help/credits" component={Credits}></Route>
                        <Route path="/not-found" component={NotFound}></Route>
                        <Redirect
                            from="/help"
                            exact
                            to="/help/tutorial"
                        ></Redirect>
                        <Redirect to="/not-found"></Redirect>
                    </Switch>
                </main>
            </>
        );
    }
}

export default Help;
