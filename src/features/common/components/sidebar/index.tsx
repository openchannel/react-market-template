import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarItem } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from '../../hooks';
import { SelectedFilter } from '../../../apps/store/apps/types';
import { setSearchPayload } from '../../../apps/store/apps/actions';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

interface SidebarProps {
  mode?: 'home' | 'search';
}

export const Sidebar: React.FC<SidebarProps> = ({ mode = 'home' }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { filters } = useTypedSelector(({ apps }) => apps);
  const { selectedFilters } = useTypedSelector(({ apps }) => apps);

  const updateSearchPayload = React.useCallback(
    (selectedFilters: SelectedFilter[]) => {
      dispatch(setSearchPayload({ filters: selectedFilters }));
    },
    [dispatch, setSearchPayload],
  );

  const handleFilterClick = React.useCallback(
    (id: string, selectedFilter: SidebarItem) => {
      if (mode === 'home') {
        history.push(`/${BROWSE}/${id}/${selectedFilter.parent.id}`);
      } else {
        const filter = { id, ...selectedFilter };
        const newSelectedFilters = selectedFilters.filters.filter(
          (i) => i.parent.id !== filter.parent.id || i.child?.id !== filter.child?.id,
        );

        // filter was unselected
        if (newSelectedFilters.length !== selectedFilters.filters.length) {
          updateSearchPayload(id === COLLECTIONS ? [] : newSelectedFilters);
        } else {
          updateSearchPayload(id === COLLECTIONS ? [filter] : [...selectedFilters.filters, filter]);
        }
      }
    },
    [updateSearchPayload, selectedFilters],
  );

  return (
    <>
      {filters?.map(
        (filter) =>
          filter.values &&
          filter.values.length > 0 && (
            <OcSidebar
              key={filter.id}
              title={filter.name}
              sidebarModel={filter.values}
              selectedItems={selectedFilters.filters}
              onItemClick={(i) => handleFilterClick(filter.id, i)}
            />
          ),
      )}
    </>
  );
};

export default Sidebar;
