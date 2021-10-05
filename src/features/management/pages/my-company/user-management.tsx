import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OcMenuUserGrid } from '@openchannel/react-common-components/dist/ui/management/organisms';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../common/hooks';
import { getAllUsers, sortMyCompany } from '../../../common/store/user-invites';
import { clearUserProperties } from '../../../common/store/user-invites/actions';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { userProperties, sortQuery } = useTypedSelector(({ userInvites }) => userInvites);
  const { data } = userProperties;
  const { pageNumber, pages, list } = data;

  const catchSortChanges = (sortBy: string) => {
    dispatch(sortMyCompany(sortBy));
  };

  const loadPage = (page: number) => {
    dispatch(getAllUsers(page, sortQuery));
  };

  React.useEffect(() => {
    loadPage(pageNumber);

    return () => {
      dispatch(clearUserProperties());
    };
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={list.length}
        next={() => loadPage(pageNumber + 1)}
        hasMore={pageNumber < pages}
        loader={null}
      >
        <OcMenuUserGrid onMenuClick={() => {}} onSort={catchSortChanges} properties={userProperties} />
      </InfiniteScroll>
    </>
  );
};

export default UserManagement;
