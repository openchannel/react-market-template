import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarItem } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from '../../hooks';
import queryString from 'querystring';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

interface SelectedItem extends SidebarItem {
  id: string;
}

export const Sidebar: React.FC = () => {
  const history = useHistory();
  const { filters } = useTypedSelector(({ apps }) => apps);
  const [selectedItems, setSelectedItems] = React.useState<SelectedItem[]>([]);

  console.log('filters', filters);

  const historyFunc = React.useMemo<'replace' | 'push'>(() => {
    const { pathname: path } = history.location;
    return path.startsWith(`/${BROWSE}`) ? 'replace' : 'push';
  }, [history]);

  const buildQuery = React.useCallback((selectedItems: SelectedItem[]): string => {
    const query = selectedItems.reduce((acc: { [key: string]: string }, val: { id: string } & SidebarItem) => {
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
    (selectedItems) => {
      switch (true) {
        case !selectedItems.length:
          history[historyFunc]('/');
          break;
        case selectedItems.length === 1:
          history[historyFunc](`/${BROWSE}/${selectedItems[0].id}/${selectedItems[0].parent.id}`);
          break;
        default:
          history[historyFunc](`/${BROWSE}?${buildQuery(selectedItems)}`);
      }
    },
    [buildQuery, history, historyFunc],
  );

  const updateSelectedItems = React.useCallback(
    (selectedItems: SelectedItem[]) => {
      setSelectedItems(selectedItems);
      updatePath(selectedItems);
    },
    [setSelectedItems, updatePath],
  );

  React.useEffect(() => {
    if (!filters || !filters.length) {
      return;
    }

    const { pathname: path, search } = history.location;
    const [id, parentId] = path.split('/').filter((p) => p !== BROWSE && !!p);
    if (id) {
      const selectedItem = filters
        .filter((f) => f.id === id)
        .flatMap((f) => f.values)
        .filter((v) => v.id === parentId);

      if (selectedItem && selectedItem[0]) {
        updateSelectedItems([{ id, parent: selectedItem[0] }]);
      }
    } else if (search.length > 0) {
      const query = Object.entries(queryString.parse(search.replace(/^\?/, ''))).reduce(
        (obj: { [key: string]: string[] }, [key, value]) => {
          obj[key] = !value ? [] : Array.isArray(value) ? value : value.split(',');
          return obj;
        },
        {} as { [key: string]: string[] },
      );
      const newSelectedItems = Object.entries(query).flatMap(([key, value]) =>
        filters
          .filter((f) => f.id === key)
          .flatMap((f) => f.values)
          .filter((v) => value.includes(v.id!))
          .map((v) => ({ id: key, parent: v })),
      );
      updateSelectedItems(newSelectedItems);
    }
  }, [history, filters, updateSelectedItems]);

  const handleItemClick = React.useCallback(
    (id: string, selectedItem: SidebarItem) => {
      const item = { id, ...selectedItem };
      const newSelectedItems = selectedItems.filter(
        (i) => i.parent.id !== item.parent.id || i.child?.id !== item.child?.id,
      );

      // item was unselected
      if (newSelectedItems.length !== selectedItems.length) {
        updateSelectedItems(id === COLLECTIONS ? [] : newSelectedItems);
      } else {
        updateSelectedItems(id === COLLECTIONS ? [item] : [...selectedItems, item]);
      }
    },
    [updateSelectedItems, selectedItems],
  );

  return (
    <>
      {filters?.map(
        (item) =>
          item.values &&
          item.values.length > 0 && (
            <OcSidebar
              key={item.id}
              title={item.name}
              sidebarModel={item.values}
              selectedItems={selectedItems}
              onItemClick={(i) => handleItemClick(item.id, i)}
            />
          ),
      )}
    </>
  );
};

export default Sidebar;
