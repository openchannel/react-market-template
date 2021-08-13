import * as React from 'react';
import { OcProfileNavbar, DropdownModel } from '@openchannel/react-common-components';
import { PermissionType, AccessLevel } from '@openchannel/react-common-services';
import { Link } from 'react-router-dom';
import { storage } from '@openchannel/react-common-services';

import logo from '../../../../assets/img/logo-company.png';
import './style.scss';
// !!Redo all links to divs with onclick with history.push(router link)
const hasCompanyPermission = storage.hasAnyPermission([
  { type: PermissionType.ORGANIZATIONS, access: [AccessLevel.READ, AccessLevel.MODIFY, AccessLevel.DELETE] },
]);
const isSSO = storage.getUserDetails()?.isSSO;

const options = [
  !isSSO ? { label: 'My Profile', value: '/management/profile' } : undefined,
  hasCompanyPermission ? [{ label: 'My company', value: 'management/company' }] : undefined,
  { label: 'Logout', value: 'logout' },
].filter(Boolean) as DropdownModel<string>[];

export const Header = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);

  const isUserLoggedIn = storage.isUserLoggedIn();

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
              {isUserLoggedIn && (
                <li className="nav-item">
                  <Link to="/management/apps" onClick={closedMenu} className="nav-link cursor-pointer">
                    My apps
                  </Link>
                </li>
              )}
              {isUserLoggedIn && (
                <li className="nav-item">
                  <div className="options-wrapper">
                    <OcProfileNavbar username="More" options={options} initials="" />
                  </div>
                </li>
              )}
            </ul>

            {isUserLoggedIn && (
              <div className="collaps-items">
                {isMenuCollapsed && (
                  <div id="collapsMoreContent" className="collapse">
                    <ul className="navbar-nav ml-5">
                      <li className="nav-item">
                        {
                          /* !isSSO &&  */ <Link
                            className="nav-link cursor-pointer"
                            to="/management/profile"
                            onClick={() => setIsMenuCollapsed(true)}
                          >
                            My Profile
                          </Link>
                        }
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link cursor-pointer"
                          to="/management/company"
                          onClick={() => setIsMenuCollapsed(true)}
                          // [appPermissions]="companyPermissions"
                        >
                          My Company
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link cursor-pointer" to="/" /* (click)="logout()" */>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!isUserLoggedIn && (
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

{
  /* {false && (
  // eslint-disable-next-line
  <li
  className="nav-item justify-content-between align-items-center"
  [class.active]="checkIncludesUrl('/management/profile', '/management/company')"
  onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
  data-target="#collapsMoreContent"
  aria-controls="collapsMoreContent"
  >
  
  <div
  className="dropdown-item cursor-pointer" ngIf="!isSSO"
  routerLink="/management/profile"
  >
  My Profile
  </div>
  <div
  [appPermissions]="companyPermissions" className="dropdown-item cursor-pointer"
  routerLink="/management/company"
  >
  My Company
  </div>
  <div className="dropdown-item cursor-pointer" (click)="logout()">Logout</div>
  
  </li>
)} */
}
