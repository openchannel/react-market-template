import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarItem } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from '../../hooks';
import queryString from 'querystring';
import { SelectedFilter } from '../../../apps/store/apps/types';
import { setSelectedFilters } from '../../../apps/store/apps/actions';
import { useDispatch } from 'react-redux';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

interface SidebarProps {
  searchValue: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ searchValue }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { filters } = useTypedSelector(({ apps }) => apps);
  const { selectedFilters } = useTypedSelector(({ apps }) => apps);
  // const [selectedFilters, setSelectedFilters] = React.useState<SelectedFilter[]>([]);

  const historyFunc = React.useMemo<'replace' | 'push'>(() => {
    const { pathname: path } = history.location;
    return path.startsWith(`/${BROWSE}`) ? 'replace' : 'push';
  }, [history]);

  const buildQuery = React.useCallback((selectedFilters: SelectedFilter[]): string => {
    const query = selectedFilters.reduce((acc: { [key: string]: string }, val: SelectedFilter) => {
      if (val.parent.id) {
        if (val.id === COLLECTIONS) {
          acc[val.id] = val.parent.id;
        } else {
          acc[val.id] = !acc[val.id] ? val.parent.id : `${acc[val.id]},${val.parent.id}`;
        }
      }
      return acc;
    }, {} as { [key: string]: string });

    return Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }, []);

  const updatePath = React.useCallback(
    (selectedFilters) => {
      switch (true) {
        case !selectedFilters.length:
          history[historyFunc]('/');
          break;
        case selectedFilters.length === 1:
          history[historyFunc](`/${BROWSE}/${selectedFilters[0].id}/${selectedFilters[0].parent.id}`);
          break;
        default:
          history[historyFunc](`/${BROWSE}?${buildQuery(selectedFilters)}`);
      }
    },
    [buildQuery, history, historyFunc],
  );

  const updateSelectedFilters = React.useCallback(
    (selectedFilters: SelectedFilter[]) => {
      dispatch(setSelectedFilters(selectedFilters, searchValue));
      updatePath(selectedFilters);
    },
    [dispatch, setSelectedFilters, updatePath],
  );

  React.useEffect(() => {
    if (!filters || !filters.length) {
      return;
    }

    const { pathname: path, search } = history.location;
    const [id, parentId] = path.split('/').filter((p) => p !== BROWSE && !!p);
    let searchValue: string;

    if (search.length > 0) {
      const searchValue = queryString.parse(search.replace(/^\?/, '')).search;
      console.log(searchValue);
    }

    if (id) {
      const selectedFilter = filters
        .filter((f) => f.id === id)
        .flatMap((f) => f.values)
        .filter((v) => v.id === parentId);

      if (selectedFilter && selectedFilter[0]) {
        updateSelectedFilters([{ id, parent: selectedFilter[0] }]);
      }
    } else if (search.length > 0) {
      const query = Object.entries(queryString.parse(search.replace(/^\?/, ''))).reduce(
        (obj: { [key: string]: string[] }, [key, value]) => {
          obj[key] = !value ? [] : Array.isArray(value) ? value : value.split(',');
          return obj;
        },
        {} as { [key: string]: string[] },
      );
      const newSelectedFilters = Object.entries(query).flatMap(([key, value]) =>
        filters
          .filter((f) => f.id === key)
          .flatMap((f) => f.values)
          .filter((v) => value.includes(v.id!))
          .map((v) => ({ id: key, parent: v })),
      );

      updateSelectedFilters(newSelectedFilters);
    }
  }, [history, filters, updateSelectedFilters]);

  const handleFilterClick = React.useCallback(
    (id: string, selectedFilter: SidebarItem) => {
      const filter = { id, ...selectedFilter };
      const newSelectedFilters = selectedFilters.filters.filter(
        (i) => i.parent.id !== filter.parent.id || i.child?.id !== filter.child?.id,
      );

      // filter was unselected
      if (newSelectedFilters.length !== selectedFilters.filters.length) {
        updateSelectedFilters(id === COLLECTIONS ? [] : newSelectedFilters);
      } else {
        updateSelectedFilters(id === COLLECTIONS ? [filter] : [...selectedFilters.filters, filter]);
      }
    },
    [updateSelectedFilters, selectedFilters],
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
