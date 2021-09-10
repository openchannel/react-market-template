import * as React from 'react';

import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { useAuth, useMedia } from '../../hooks';
import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Sidebar, CollapseWithTitle } from '../../components';

import './style.scss';

export const HomePage: React.FC = () => {
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const isMobile = useMedia();

  React.useEffect(() => {
    const init = async () => {
      try {
        checkSession();
      } catch {
        /*do nothing*/
      }

      if (!isConfigLoaded) {
        try {
          getAuthConfig();
        } catch {
          /*do nothing*/
        }
      }
    };

    init();
  }, []);
  return (
    <MainTemplate>
      <Hero />
      <div className="container">
        <div className="row mt-7">
          <div className="col-md-3 filter__container" id="main-content">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search..."
              onChange={() => {}}
              // enterAction={catchSearchText}
              searchButtonText=""
              clearButtonText=""
            />
            {isMobile && (
              <CollapseWithTitle
                titleForClose="Close filter options"
                titleForOpen="Open filter options"
                collapsed={collapsed}
                changeCollapseStatus={changeCollapseStatus}
              />
            )}
            {!collapsed && <Sidebar />}
          </div>
          <div className="col-md-9">
            <AppList />
          </div>
        </div>
      </div>
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
