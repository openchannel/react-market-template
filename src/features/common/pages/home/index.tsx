import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { useAuth, useMedia, useTypedSelector } from '../../hooks';
import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Sidebar, CollapseWithTitle } from '../../components';
import { setSelectedFilters } from '../../../apps/store/apps/actions';
import './style.scss';

export const HomePage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
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

  const handleEnterAction = () => {
    if (searchValue) {
      // dispatch(setSelectedFilters([{ id: filters[0].id, parent: filters[0].values[0] }]));
      history.push(`/browse/${filters[0].id}/${filters[0].values[0].id}?search=${searchValue}`);
    } else {
      // dispatch(setSelectedFilters([{ id: filters[0].id, parent: filters[0].values[0] }]));
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
              onChange={setSearchValue}
              value={searchValue}
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
            {!collapsed && <Sidebar searchValue={searchValue} />}
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
//What to do:
// 1. save search text (where?) and on home and add a tag on search page
// 2. make 1 request on filters on init page, and check query in pathname if present.
//                   After this, i can rely on selected filters to draw tags
// 3. make a query to backend to get apps for app-list-grid, i need to write action for this
