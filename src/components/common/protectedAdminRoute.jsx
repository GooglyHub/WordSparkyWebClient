import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

const ProtectedAdminRoute = ({
    path,
    component: Component,
    render,
    ...rest
}) => {
    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                const user = getCurrentUser();
                if (!user || !user.isAdmin) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/not-found',
                            }}
                        />
                    );
                }
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    );
};

export default ProtectedAdminRoute;
