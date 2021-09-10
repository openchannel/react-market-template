import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { MainTemplate } from 'features/common/templates';
import { Sidebar } from 'features/common/components/index';
import { AppList } from 'features/common/organisms';
import { useMedia, useTypedSelector } from 'features/common/hooks';
import CollapseWithTitle from '../../components/collapse-with-title';
import { fetchFilters } from '../../../apps/store/apps/actions';

import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
// import { OcTextSearchComponent } from '@openchannel/react-common-components';
import './style.scss';

export const SearchPage: React.FC = () => {
  const history = useHistory();
  const isMobile = useMedia();
  const dispatch = useDispatch();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const { filters } = useTypedSelector(({ apps }) => apps);
  console.log('filters', filters);

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
          <OcNavigationBreadcrumbs pageTitle="" buttonText="Back" navigateClick={historyBack} />
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
              <div /* *ngFor="let filter of filters" */>
                <div /* [ngSwitch]="filter?.id" */>
                  <Sidebar />
                </div>
              </div>
            </div>
          )}
          <div className="col-md-9">
            {/* <OcTextSearchComponent /* [(searchText)]="searchText" (enterSearch)="onTextChange($event)"  /> */}
            <div className="search-tags">
              {/*  <oc-tag-element className="search-tags__element" *ngFor="let filter of selectedFilterValues"
                          [title]="filter?.value.label" [closeMarker]="true"
                          (clickEmitter)="disableFilterValue(filter.filterId, filter.value)"></oc-tag-element>
          <oc-tag-element  className="search-tags__element"*ngIf="searchTextTag"
                          [title]="searchTextTag" [closeMarker]="true"
                          (clickEmitter)="clearSearchText()"></oc-tag-element> */}
            </div>
            <AppList />
            {/* <oc-app-list-grid [appList]="appPage?.list"
      baseLinkForOneApp="/details"
                        appNavigationParam="safeName[0]"
                        defaultAppIcon="./assets/img/default-app-icon.svg"></oc-app-list-grid> */}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default SearchPage;
