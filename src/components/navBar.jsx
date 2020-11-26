import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';

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
                    <NavLink className="nav-item nav-link" to="/leaderboard">
                        Leaderboard
                    </NavLink>
                </li>
                <li>
                    <NavLink className="nav-item nav-link" to="/account">
                        Account
                    </NavLink>
                </li>
                {!user && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/login">
                            Login
                        </NavLink>
                    </li>
                )}
                {user && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/logout">
                            Logout
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
