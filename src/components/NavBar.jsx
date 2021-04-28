import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';
import colors from './../config/colors';
import Icon from './common/icon';

const NavBar = ({ user }) => {
    return (
        <nav className="navbar navbar-light">
            <ul className="nav nav-pills">
                <img
                    src={logo}
                    width={60}
                    height={60}
                    style={{ marginRight: 20 }}
                    alt="cute shark on an orange background"
                />
                {user && (
                    <>
                        <Icon
                            name={user.icon || 'account'}
                            backgroundColor={user.color || 'blue'}
                            size={40}
                        ></Icon>
                        <div
                            style={{
                                fontSize: 20,
                                marginLeft: 10,
                                color: colors.dark,
                                alignSelf: 'center',
                                marginRight: 20,
                            }}
                        >
                            {user.displayName}
                        </div>
                        <li>
                            <NavLink className="nav-item nav-link" to="/home">
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className="nav-item nav-link" to="/create">
                                Create
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="nav-item nav-link"
                                to="/leaderboard"
                            >
                                Leaderboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="nav-item nav-link"
                                to="/account"
                            >
                                Account
                            </NavLink>
                        </li>
                        {user && user.isAdmin && (
                            <li>
                                <NavLink
                                    className="nav-item nav-link"
                                    to="/bots"
                                >
                                    Bots
                                </NavLink>
                            </li>
                        )}
                    </>
                )}
                {!user && (
                    <>
                        <li>
                            <NavLink className="nav-item nav-link" to="/login">
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="nav-item nav-link"
                                to="/register"
                            >
                                Register
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
