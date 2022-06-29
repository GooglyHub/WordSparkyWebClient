import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';
import colors from './../config/colors';
import Icon from './common/icon';
import profile from '../common/profile';

const NavBar = ({ user }) => {
    return (
        <nav className="navbar navbar-light">
            <ul className="nav nav-pills">
                <img
                    src={logo}
                    width={60}
                    height={60}
                    style={{ marginRight: 20 }}
                    alt="word sparky logo"
                />

                {user && user.isPremium && (
                    <Icon
                        name={profile.getIcon(user)}
                        backgroundColor={profile.getColor(user)}
                        size={40}
                    ></Icon>
                )}
                {user && user.isPremium && (
                    <div
                        style={{
                            fontSize: 20,
                            marginLeft: 10,
                            color: colors.dark,
                            alignSelf: 'center',
                            marginRight: 20,
                        }}
                    >
                        {user.username}
                    </div>
                )}
                {user && user.isPremium && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/home">
                            Home
                        </NavLink>
                    </li>
                )}
                {user && user.isPremium && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/create">
                            Create
                        </NavLink>
                    </li>
                )}
                {user && user.isPremium && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/account">
                            Account
                        </NavLink>
                    </li>
                )}
                {user && user.isPremium && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/help">
                            Help
                        </NavLink>
                    </li>
                )}
                {user && user.isPremium && user.isAdmin && (
                    <li>
                        <NavLink className="nav-item nav-link" to="/bots">
                            Bots
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
