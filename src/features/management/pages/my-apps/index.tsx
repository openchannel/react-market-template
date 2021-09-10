import * as React from 'react';
import { useTypedSelector } from '../../../common/hooks';
import { MainTemplate } from '../../../common/templates';
import {
  OcDropdown,
  OcDropdownButton,
  OcNavigationBreadcrumbs,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcAppShortInfo } from '@openchannel/react-common-components/dist/ui/market/molecules';
import { useDispatch } from 'react-redux';
import { clearMyApps, fetchMyApps } from '../../../apps/store/apps/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import dots from '../../../../../public/assets/img/dots-hr-icon.svg';

import './styles.scss';

declare type Option = {
  label: string;
  [key: string]: string;
};

export const MyAppsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    myApps: { data: apps, pageNumber, limit, pages, sort },
  } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    loadApps();

    return () => {
      dispatch(clearMyApps());
    };
  }, []);

  const showOptions = React.useMemo<Option[]>(
    () => [
      {
        label: 'Newest',
        value: 'created',
      },
      {
        label: 'Featured',
        value: 'featured',
      },
      {
        label: 'Publish Date (most recent)',
        value: 'publishDate',
      },
    ],
    [],
  );

  const appOptions = React.useMemo<Option[]>(
    () => [
      {
        label: 'To Do...',
        value: 'todo',
      },
    ],
    [],
  );

  const showOption = React.useMemo(
    () => showOptions.find((o) => o.value === sort) || showOptions[0],
    [showOptions, sort],
  );

  const loadApps = (page: number = pageNumber, sortValue?: string) =>
    dispatch(fetchMyApps(page, limit, sortValue || sort || showOptions[0].value));

  const handleShowOptionSelect = (v?: Option) => loadApps(1, v?.value);

  const handleClickByApp = () => {};

  const handleAppAction = () => {};

  return (
    <MainTemplate>
      <div className="my-apps">
        <div className="bg-container min-height-auto header-padding">
          <OcNavigationBreadcrumbs pageTitle="My apps" navigateText={'Back'} />
        </div>
        <div className="container">
          <div className="d-flex justify-content-end pt-4 pb-3">
            <OcDropdown title="Show" options={showOptions} selected={showOption} onSelect={handleShowOptionSelect} />
          </div>
          <InfiniteScroll
            dataLength={apps.length}
            next={() => loadApps(pageNumber + 1)}
            hasMore={pageNumber < pages}
            loader={null}
          >
            {apps.map((app) => (
              <div key={app.appId} className="mb-2">
                <OcAppShortInfo
                  app={app}
                  clickByApp={handleClickByApp}
                  customDropdown={
                    <OcDropdownButton options={appOptions} onSelect={handleAppAction}>
                      <button className="btn btn-outline-info menu-button">
                        <img alt="Button with dots" className="user-table__menu-icon-dots" src={dots} />
                      </button>
                    </OcDropdownButton>
                  }
                />
              </div>
            ))}
          </InfiniteScroll>
          <div className="mt-8" />
        </div>
      </div>
    </MainTemplate>
  );
};

export default MyAppsPage;
