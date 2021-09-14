import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { useAuth, useMedia, useTypedSelector } from '../../hooks';
import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Sidebar, CollapseWithTitle } from '../../components';
import { setSearchPayload, resetSelectedFilters } from '../../../apps/store/apps/actions';

import './style.scss';

//  NEED to do: add tags, make backend query for apps, make enterClick on text search

export const HomePage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const { filters, selectedFilters } = useTypedSelector(({ apps }) => apps);
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
    dispatch(resetSelectedFilters());
  }, []);

  const handleEnterAction = () => {
    if (selectedFilters.searchStr) {
      history.push(`/browse/${filters[0].id}/${filters[0].values[0].id}?search=${selectedFilters.searchStr}`);
    } else {
      history.push(`/browse/collections/allApps`);
    }
  };

  return (
    <MainTemplate>
      <Hero />
      <div className="container">
        <div className="row mt-7">
          <div className="col-md-3 filter__container" id="main-content">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search..."
              onChange={(searchStr: string) => {
                dispatch(setSearchPayload({ searchStr }));
              }}
              value={selectedFilters.searchStr}
              enterAction={handleEnterAction}
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
