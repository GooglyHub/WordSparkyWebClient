import { NavLink } from 'react-router-dom';

const AccountNavBar = () => {
    return (
        <>
            <nav
                className="navbar navbar-light"
                style={{ borderTop: '1px solid black', marginLeft: 70 }}
            >
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
                                to="/account/vercode"
                            >
                                Verification Code
                            </NavLink>
                        </li>
                        {/* <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/account/bots"
                        >
                            Puzzle Bots
                        </NavLink>
                    </li> */}
                    </>
                </ul>
            </nav>
        </>
    );
};

export default AccountNavBar;
