import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OcProfileNavbar, DropdownModel } from '@openchannel/react-common-components/dist/common/molecules';
import { Link } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import { notify } from '../toast-notify/toast';
import { hasCompanyPermission, isSSO, isUserLoggedIn, logout } from './utils';

import logo from '../../../../assets/img/logo-company.png';
import './style.scss';

const options = [
  !isSSO() ? { label: 'My Profile', value: '/management/profile' } : undefined,
  hasCompanyPermission() ? [{ label: 'My company', value: 'management/company' }] : undefined,
  { label: 'Logout', value: 'logout' },
].filter(Boolean) as DropdownModel<string>[];

export const Header = (): JSX.Element => {
  // const history = useHistory();
  // notify.success('Notify');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);

  const closedMenu = (): void => {
    setIsMenuCollapsed(true);
    setIsCollapsed(true);
  };
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white">
      <div className="container">
        <div className="navbar-wrapper">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="brand-logo" className="company-logo" />
          </Link>
          <button
            className="navbar-toggler p-0"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className={`cursor-pointer ${isCollapsed ? 'navbar-icon' : 'close-icon'}`}></div>
          </button>
        </div>
        <Link to="#main-content" className="skip-link">
          Skip to main content
        </Link>
        {!isCollapsed && (
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-end w-100 mb-0">
              <li className="nav-item">
                <Link to="/" onClick={closedMenu} className="nav-link cursor-pointer">
                  Browse
                </Link>
              </li>
              {isUserLoggedIn() && (
                <li className="nav-item">
                  <Link
                    to="/management/apps"
                    onClick={() => setIsMenuCollapsed(true)}
                    className="nav-link cursor-pointer"
                  >
                    My apps
                  </Link>
                </li>
              )}
              {isUserLoggedIn() && (
                <li className="nav-item">
                  <div className="options-wrapper">
                    <OcProfileNavbar username="More" options={options} initials="" />
                  </div>
                </li>
              )}
            </ul>

            {isUserLoggedIn() && (
              <div className="collaps-items">
                {isMenuCollapsed && (
                  <div id="collapsMoreContent" className="collapse">
                    <ul className="navbar-nav ml-5">
                      <li className="nav-item">
                        {!isSSO() && (
                          <Link
                            className="nav-link cursor-pointer"
                            to="/management/profile"
                            onClick={() => setIsMenuCollapsed(true)}
                          >
                            My Profile
                          </Link>
                        )}
                      </li>
                      {hasCompanyPermission() && (
                        <li className="nav-item">
                          <Link
                            className="nav-link cursor-pointer"
                            to="/management/company"
                            onClick={() => setIsMenuCollapsed(true)}
                          >
                            My Company
                          </Link>
                        </li>
                      )}
                      <li className="nav-item">
                        <Link className="nav-link cursor-pointer" to="/" onClick={() => logout()}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!isUserLoggedIn() && (
              <div className="d-flex my-2 my-lg-0 ml-0 ml-md-6 auth-button">
                <Link
                  className="btn header-login-btn header-btn"
                  to="/login"
                  /*[queryParams]="{ returnUrl: getUrlWithoutFragment() }" */
                >
                  Log in
                </Link>
                <Link className="btn btn-primary header-btn ml-md-2" to="/signup" /*ngIf="!isSsoConfigExist" */>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
