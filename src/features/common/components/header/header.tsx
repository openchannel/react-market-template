import * as React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { DropdownModel } from '@openchannel/react-common-components';
import { OcProfileNavbar } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useMedia } from '../../hooks';
import logo from '../../../../../public/assets/img/logo-company.png';
import { hasCompanyPermission, isSSO, isUserLoggedIn } from './utils';
import './style.scss';

export const Header = ({ cmsData }: any): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuCollapsed, setIsMobileMenuCollapsed] = React.useState(false);
  const history = useHistory();
  const isMobile = useMedia();

  React.useEffect(() => {
    isMobile ? setIsCollapsed(false) : setIsCollapsed(true);
  }, [isMobile]);

  const options = [
    !isSSO() ? { label: 'My Profile', value: '/management/profile' } : undefined,
    hasCompanyPermission() ? { label: 'My company', value: '/management/company' } : undefined,
    { label: 'Logout', value: 'logout' },
  ].filter(Boolean) as DropdownModel<string>[];

  const closedMenu = (): void => {
    if (!isMobile) return;
    setIsMobileMenuCollapsed(false);
    setIsCollapsed(false);
  };

  const toggleMenu = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMenuMore = React.useCallback(() => {
    setIsMobileMenuCollapsed((prev) => !prev);
  }, []);

  const onMenuLinkClick = React.useCallback(
    (e) => {
      if (e.target.dataset.href !== 'logout') {
        history.push(e.target.dataset.href);
      }
    },
    [history.push],
  );

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
            onClick={toggleMenu}
          >
            <div className={`cursor-pointer ${!isCollapsed ? 'navbar-icon' : 'close-icon'}`} />
          </button>
        </div>
        <Link to="#main-content" className="skip-link">
          Skip to main content
        </Link>
        {isCollapsed && (
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-end w-100 mb-0">
              {cmsData?.headerItemsDFA?.map((item: any) => {
                const validPath = item.location || '/';
                return (
                  <li className={`nav-item ${location.pathname === validPath ? 'active' : ''}`} key={validPath}>
                    <Link to={validPath} className="nav-link cursor-pointer" onClick={closedMenu}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {isUserLoggedIn() && (
                <li className="nav-item">
                  <div className="options-wrapper">
                    <OcProfileNavbar username="More" options={options} initials="" />
                  </div>
                </li>
              )}
              {isMobile && (
                <>
                  <li className="nav-item">
                    <Link to="#" className="nav-link" onClick={toggleMenuMore}>
                      More
                    </Link>
                  </li>
                  <div className="collaps-items">
                    {
                      <div id="collapsMoreContent" className={`collapse ${isMobileMenuCollapsed ? 'show' : ''}`}>
                        <ul className="navbar-nav ml-5">
                          {options.map((item) => (
                            <li className="nav-item" key={item.value}>
                              <span
                                className="nav-link cursor-pointer"
                                role="button"
                                tabIndex={0}
                                data-href={item.value}
                                onClick={onMenuLinkClick}
                                onKeyDown={onMenuLinkClick}
                              >
                                {item.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  </div>
                </>
              )}
              {!isUserLoggedIn() && (
                <div className="d-flex my-2 my-lg-0 ml-0 ml-md-6 auth-button">
                  <Link className="btn header-login-btn header-btn" to="/login">
                    Log in
                  </Link>
                  <Link className="btn btn-primary header-btn ml-md-2" to="/signup">
                    Sign up
                  </Link>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
