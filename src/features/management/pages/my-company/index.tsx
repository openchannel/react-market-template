import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { MainTemplate } from '../../../common/templates';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { storage } from '@openchannel/react-common-services';
import { page, pageIds } from './constants';
import './styles.scss';
import UserManagement from './userManagement';

const Company = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState(pageIds.company);
  const history = useHistory();

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history.goBack]);

  const filterPagesByUserType = page.filter((page) => storage.hasAnyPermission(page.permissions));

  const onClickPass = React.useCallback(
    (e) => {
      setSelectedPage(e.target.dataset.link);
    },
    [setSelectedPage],
  );

  return (
    <MainTemplate>
      <div className="bg-container height-unset">
        <OcNavigationBreadcrumbs pageTitle="My company" navigateText="Back" navigateClick={historyBack} />
      </div>

      <div className="container">
        <div className="row pt-5">
          <div className="col-md-3 col-lg-2 col-xl-3">
            <ul className="list-unstyled">
              {filterPagesByUserType.map((elem) => (
                <li className="py-1" key={elem.pageId}>
                  <span
                    className={`font-m ${isSelectedPage === elem.pageId ? 'active-link' : ''}`}
                    role="button"
                    tabIndex={0}
                    data-link={elem.pageId}
                    onClick={onClickPass}
                    onKeyDown={onClickPass}
                  >
                    {elem.placeholder}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-9 col-lg-10 col-xl-9 pt-1">
            {isSelectedPage === pageIds.profile && <UserManagement />}
          </div>
        </div>
      </div>
      <div className="mt-8" />
    </MainTemplate>
  );
};

export default Company;
