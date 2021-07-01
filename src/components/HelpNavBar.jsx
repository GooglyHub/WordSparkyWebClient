import { NavLink } from 'react-router-dom';

const HelpNavBar = () => {
    return (
        <nav className="navbar navbar-light" style={{ marginLeft: 150 }}>
            <ul className="nav nav-pills">
                <>
                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/help/tutorial"
                        >
                            How to Play
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/help/privacy"
                        >
                            Privacy Policy
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="nav-item nav-link"
                            to="/help/credits"
                        >
                            Credits
                        </NavLink>
                    </li>
                </>
            </ul>
        </nav>
    );
};

export default HelpNavBar;
