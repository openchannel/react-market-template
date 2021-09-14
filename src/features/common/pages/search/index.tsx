import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'querystring';
import { debounce } from 'lodash';

import { MainTemplate } from 'features/common/templates';
import { Sidebar } from 'features/common/components/index';
import { useMedia, useTypedSelector } from 'features/common/hooks';
import CollapseWithTitle from '../../components/collapse-with-title';
import {
  fetchFilters,
  resetSelectedFilters,
  setSearchPayload,
  fetchFilteredApps,
} from '../../../apps/store/apps/actions';

import { OcAppListGrid } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcTagElement } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { QueryUtil } from '@openchannel/react-common-services';
import { SelectedFilter, SelectedFilters } from 'features/apps/store/apps/types';
import closeIconUrl from '../../../../../public/assets/img/close-icon.png';
import defaultAppIcon from '../../../../../public/assets/img/default-app-icon.svg';

import './style.scss';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

export const SearchPage: React.FC = () => {
  const history = useHistory();
  const isMobile = useMedia();
  const dispatch = useDispatch();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const { filters, selectedFilters, filteredApps } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    if (!filters || !filters.length) {
      dispatch(fetchFilters());
    }
  }, [filters]);

  // read values from URL
  React.useEffect(() => {
    if (!filters || !filters.length) {
      return;
    }

    const { pathname: path, search } = history.location;
    const parsedSearch = queryString.parse(search.replace(/^\?/, ''));
    const [id, parentId] = path.split('/').filter((p) => p !== BROWSE && !!p);
    const searchPayload: Partial<SelectedFilters> = { filters: [], searchStr: '' };
    if (id) {
      const selectedFilter = filters
        .filter((f) => f.id === id)
        .flatMap((f) => f.values)
        .filter((v) => v.id === parentId);

      if (selectedFilter && selectedFilter[0]) {
        searchPayload.filters = [{ id, parent: selectedFilter[0] }];
      }
    } else if (search.length > 0) {
      const query = Object.entries(parsedSearch).reduce((obj: { [key: string]: string[] }, [key, value]) => {
        obj[key] = !value ? [] : Array.isArray(value) ? value : value.split(',');

        return obj;
      }, {} as { [key: string]: string[] });

      searchPayload.filters = Object.entries(query).flatMap(([key, value]) =>
        filters
          .filter((f) => f.id === key)
          .flatMap((f) => f.values)
          .filter((v) => value.includes(v.id!))
          .map((v) => ({ id: key, parent: v })),
      );
    }

    searchPayload.searchStr = parsedSearch.search as string;

    dispatch(setSearchPayload(searchPayload));
  }, [history, filters, dispatch]);

  React.useEffect(() => {
    const query = buildQuery(selectedFilters);
    history.replace(`/${BROWSE}/${query}`);
  }, [selectedFilters]);

  const buildQuery = ({ filters, searchStr }: SelectedFilters): string => {
    const query = filters.reduce((acc: { [key: string]: string }, val: SelectedFilter) => {
      if (val.parent.id) {
        if (val.id === COLLECTIONS) {
          acc[val.id] = val.parent.id;
        } else {
          acc[val.id] = !acc[val.id] ? val.parent.id : `${acc[val.id]},${val.parent.id}`;
        }
      }
      return acc;
    }, {} as { [key: string]: string });

    if (searchStr.length > 0) {
      query.search = searchStr;
    }

    return Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  };

  const historyBack = React.useCallback(() => {
    history.goBack();
    dispatch(resetSelectedFilters());
  }, [history]);

  const handleTagClick = (title: string, id?: string) => {
    const newClearedFilters = id
      ? selectedFilters.filters.filter((filter) => filter.parent.id !== id)
      : selectedFilters.filters.filter((filter) => filter.parent.label !== title);
    dispatch(setSearchPayload({ filters: newClearedFilters }));
  };

  React.useEffect(() => {
    const queryFromSelectedFilters = QueryUtil.getAndQuery(
      selectedFilters.filters.map((filter) => filter.parent.query || '').filter(Boolean),
    );
    dispatch(fetchFilteredApps(selectedFilters.searchStr, ['name'], queryFromSelectedFilters));
    window.scrollTo(0, 0);
  }, [selectedFilters]);

  const handleTagDelete = () => {
    setSearchText('');
    dispatch(setSearchPayload({ searchStr: '' }));
  };

  const search = debounce((searchStr: string) => {
    dispatch(setSearchPayload({ searchStr }));
  }, 300);

  const handleSearchTextEnter = React.useCallback(() => {
    search(searchText);
  }, [searchText]);

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
        <div className="filter-container row">
          {!collapsed && (
            <div className="col-md-3">
              <Sidebar mode="search" />
            </div>
          )}
          <div className="col-md-9">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search..."
              value={searchText}
              onChange={setSearchText}
              enterAction={handleSearchTextEnter}
              searchButtonText=""
              clearButtonText=""
            />
            <div className="search-tags">
              {selectedFilters.filters.map((filter) => (
                <OcTagElement
                  // id={filter.id}
                  title={filter?.parent.label}
                  onIconClick={() => handleTagClick(filter.parent.label)}
                  deleteTagImgUrl={closeIconUrl}
                  key={filter.id + filter.parent.id}
                />
              ))}
              {selectedFilters.searchStr && (
                <OcTagElement
                  title={selectedFilters.searchStr}
                  deleteTagImgUrl={closeIconUrl}
                  onIconClick={handleTagDelete}
                />
              )}
            </div>
            <OcAppListGrid
              appList={filteredApps}
              // baseLinkForOneApp="/details"
              // appNavigationParam="safeName[0]"
              defaultAppIcon={defaultAppIcon}
            />
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default SearchPage;
