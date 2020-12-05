import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';
import Icon from '@material-ui/core/Icon';
import colors from './../config/colors';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { getCoins } from '../services/coinsService';

const NavBar = ({ user }) => {
    const [coins, setCoins] = useState(0);

    useEffect(() => {
        async function fetchCoins() {
            try {
                const response = await getCoins();
                setCoins(response.data.coins);
            } catch (ex) {
                console.log(ex);
            }
        }
        fetchCoins();
    }, []);

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
                            style={{
                                backgroundColor: user.color || 'blue',
                                color: 'white',
                                borderRadius: 20,
                                width: 40,
                                height: 40,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                display: 'flex',
                            }}
                            fontSize="default"
                        >
                            {user.icon || 'account'}
                        </Icon>
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
                        <li>
                            <NavLink className="nav-item nav-link" to="/logout">
                                Logout
                            </NavLink>
                        </li>
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
            <div
                style={{
                    position: 'absolute',
                    right: 20,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    display: 'flex',
                }}
            >
                <MonetizationOnIcon
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.light,
                        borderRadius: 13,
                        width: 25,
                        height: 25,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        display: 'flex',
                        marginRight: 5,
                    }}
                    fontSize="default"
                />
                <span>{coins}</span>
            </div>
        </nav>
    );
};

export default NavBar;
