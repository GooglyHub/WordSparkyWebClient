import { NavLink } from 'react-router-dom';

const AccountNavBar = () => {
    return (
        <nav className="navbar navbar-light" style={{ marginLeft: 150 }}>
            <ul className="nav nav-pills">
                <>
                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/account/profile"
                        >
                            Profile
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/account/friends"
                        >
                            Friends
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/account/bots"
                        >
                            Puzzle Bots
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/account/changepassword"
                        >
                            Change Password
                        </NavLink>
                    </li>
                </>
            </ul>
        </nav>
    );
};

export default AccountNavBar;
