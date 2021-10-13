import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { useAuth, useMedia, useTypedSelector } from '../../hooks';
import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Sidebar, CollapseWithTitle } from '../../components';

import './style.scss';
import { SelectedFilter } from 'features/apps/store/apps/types';

export const HomePage: React.FC = () => {
  const history = useHistory();
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchStr, setSearchStr] = React.useState('');
  const { filters } = useTypedSelector(({ apps }) => apps);
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

  const goToSearch = React.useCallback((selectedFilter: SelectedFilter, searchStr?: string) => {
    let path = `/browse/${selectedFilter.id}/${selectedFilter.parent.id}`;
    if (searchStr && searchStr.length > 0) {
      path += `?search=${searchStr}`;
    }
    history.push(path);
  }, []);

  const handleSearchSubmit = React.useCallback(() => {
    const firstFilter = filters[0];
    goToSearch({ id: firstFilter.id, parent: firstFilter.values[0] }, searchStr);
  }, [filters, goToSearch, searchStr]);

  const handleSidebarClick = React.useCallback(
    (selectedFilter: SelectedFilter) => {
      goToSearch(selectedFilter);
    },
    [goToSearch],
  );

  return (
    <MainTemplate>
      <Hero />
      <div className="container">
        <div className="row mt-7">
          <div className="col-md-3 filter__container" id="main-content">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search..."
              onChange={setSearchStr}
              value={searchStr}
              enterAction={handleSearchSubmit}
              searchButtonText=""
              clearButtonText=""
            />
            {isMobile && (
              <CollapseWithTitle
                titleForClose="Close filter options"
                titleForOpen="Open filter options"
                collapsed={collapsed}
                changeCollapseStatus={setCollapsed}
              />
            )}
            {!collapsed && <Sidebar items={filters} onItemClick={handleSidebarClick} />}
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
