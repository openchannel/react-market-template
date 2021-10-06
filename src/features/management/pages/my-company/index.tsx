import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { storage } from '@openchannel/react-common-services';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { MainTemplate } from '../../../common/templates';
import InviteUserModal from './components/invite-user-modal';

import { page, pageIds } from './constants';
import UserManagement from './user-management';
import './styles.scss';

const MyCompany = (): JSX.Element => {
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(pageIds.company);
  const [isOpenInviteModal, setOpenInviteModal] = React.useState(false);

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history.goBack]);

  const filterPagesByUserType = page.filter((page) => storage.hasAnyPermission(page.permissions));

  const onClickPass = React.useCallback((e) => {
    setSelectedPage(e.target.dataset.link);
  }, []);

  const openInviteModal = React.useCallback(() => {
    setOpenInviteModal(true);
  }, []);

  const closeInviteModal = React.useCallback(() => {
    setOpenInviteModal(false);
  }, []);

  return (
    <MainTemplate>
      <div className="bg-container height-unset">
        <OcNavigationBreadcrumbs
          pageTitle="My company"
          navigateText="Back"
          navigateClick={historyBack}
          buttonText={
            // show button only if the selected page is a 'profile'
            selectedPage === pageIds.profile ? 'Invite a member' : ''
          }
          buttonClick={openInviteModal}
        />
      </div>
      <div className="container mb-8">
        <div className="row pt-5">
          <div className="col-md-3 col-lg-2 col-xl-3">
            <ul className="list-unstyled">
              {filterPagesByUserType.map((elem) => (
                <li className="py-1" key={elem.pageId}>
                  <span
                    className={`font-m ${selectedPage === elem.pageId ? 'active-link' : ''}`}
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
            {selectedPage === pageIds.profile && <UserManagement />}
          </div>
        </div>
      </div>

      <InviteUserModal isOpened={isOpenInviteModal} closeModal={closeInviteModal} />
    </MainTemplate>
  );
};

export default MyCompany;
