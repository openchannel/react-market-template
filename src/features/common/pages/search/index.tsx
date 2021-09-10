import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { MainTemplate } from 'features/common/templates';
import { Sidebar } from 'features/common/components/index';
import { useMedia, useTypedSelector } from 'features/common/hooks';
import CollapseWithTitle from '../../components/collapse-with-title';
import { fetchFilters } from '../../../apps/store/apps/actions';

import { OcAppListGrid } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcTagElement } from '@openchannel/react-common-components/dist/ui/common/atoms';
import queryString from 'querystring';
import './style.scss';

export const SearchPage: React.FC = () => {
  const history = useHistory();
  const isMobile = useMedia();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = React.useState('');
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const { filters } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    const { search: searchParams } = history.location;

    if (searchParams.length) {
      const { search } = queryString.parse(searchParams.replace(/^\?/, ''));
      setSearchValue(search as string);
    }
  }, []);

  React.useEffect(() => {
    if (!filters || !filters.length) {
      dispatch(fetchFilters());
    }
  }, [filters]);

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <MainTemplate>
      <div className="container">
        <div className="navigation-container d-flex flex-row">
          <OcNavigationBreadcrumbs pageTitle="" navigateText="Back" navigateClick={historyBack} />
        </div>
        <div className="filter-open-close">
          {isMobile && (
            <CollapseWithTitle
              titleForClose="Close filter options"
              titleForOpen="Open filter options"
              collapsed={collapsed}
              changeCollapseStatus={changeCollapseStatus}
            />
          )}
        </div>
        <div className="filter-container row" /* *ngIf="loadFilters$ | async" */>
          {!collapsed && (
            <div className="col-md-3" /* [class.hide-filters]="isHideFilter" */>
              <Sidebar searchValue={searchValue} />
            </div>
          )}
          <div className="col-md-9">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search..."
              onChange={setSearchValue}
              // enterAction={catchSearchText}
              searchButtonText=""
              clearButtonText=""
            />
            <div className="search-tags">
              {/* selectedFilterValues.map((filter) => (
                <OcTagElement
                  title={filter?.value.label}
                  // (clickEmitter)="disableFilterValue(filter.filterId, filter.value)"
                  key={filter.id}
                />
              ))} */}
              {/* {searchTextTag && (
                <OcTagElement
                  title="searchTextTag"
                  // (clickEmitter)="clearSearchText()"
                />
              )} */}
            </div>
            <OcAppListGrid
              appList={[]}
              // [appList]="appPage?.list"
              // baseLinkForOneApp="/details"
              // appNavigationParam="safeName[0]"
              // defaultAppIcon="./assets/img/default-app-icon.svg"
            />
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default SearchPage;
/*
  presence of search tag can be parsed from location pathname, 
  selected filters can be gotten from redux state,
  apps for list grid can be queried from location pathname also,
  tags can be rendered from query! or selectedFilters?
 */
