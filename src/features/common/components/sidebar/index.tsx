import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarItem } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from '../../hooks';
import queryString from 'querystring';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

export const Sidebar: React.FC = () => {
  const history = useHistory();
  const { filters } = useTypedSelector(({ apps }) => apps);
  const [selectedItems, setSelectedItems] = React.useState<({ id: string } & SidebarItem)[]>([]);

  React.useEffect(() => {
    const path = history.location.pathname;
    const search = history.location.search;

    const [id, parentId] = path.split('/').filter((p) => p !== BROWSE && !!p);
    if (id) {
      const selectedItem = filters
        .filter((f) => f.id === id)
        .flatMap((f) => f.values)
        .filter((v) => v.id === parentId);

      if (selectedItem && selectedItem[0]) {
        setSelectedItems([{ id, parent: selectedItem[0] }]);
      }
    } else if (search.length > 0) {
      const query: any = Object.entries(queryString.parse(search.replace(/^\?/, ''))).reduce(
        (obj: any, [key, value]) => {
          obj[key] = !value ? value : Array.isArray(value) ? value : value.split(',');
          return obj;
        },
        {},
      );
      const newSelectedItems = Object.entries(query).flatMap(([key, value]) =>
        filters
          .filter((f) => f.id === key)
          .flatMap((f) => f.values)
          .filter((v) => (value as any[]).includes(v.id))
          .map((v) => ({ id: key, parent: v })),
      );
      setSelectedItems(newSelectedItems);
    }
  }, [filters, setSelectedItems]);

  const buildQuery = React.useCallback((): string => {
    const query: any = selectedItems.reduce((acc, val) => {
      if (val.id === COLLECTIONS) {
        acc[val.id] = val.parent.id;
      } else {
        acc[val.id] = !acc[val.id] ? val.parent.id : `${acc[val.id]},${val.parent.id}`;
      }

      return acc;
    }, {} as any);

    return Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }, [selectedItems]);

  React.useEffect(() => {
    if (!filters || !filters.length) {
      return;
    }

    switch (true) {
      case !selectedItems.length:
        history.replace('/');
        break;
      case selectedItems.length === 1:
        history.replace(`/${BROWSE}/${selectedItems[0].id}/${selectedItems[0].parent.id}`);
        break;
      default:
        history.replace(`/${BROWSE}?${buildQuery()}`);
    }
  }, [filters, selectedItems, buildQuery]);

  const handleItemClick = React.useCallback(
    (id: string, selectedItem: SidebarItem) => {
      const item = { id, ...selectedItem };
      const newSelectedItems = selectedItems.filter(
        (i) => i.parent.id !== item.parent.id || i.child?.id !== item.child?.id,
      );

      // item was unselected
      if (newSelectedItems.length !== selectedItems.length) {
        setSelectedItems(id === COLLECTIONS ? [] : newSelectedItems);
      } else {
        setSelectedItems(id === COLLECTIONS ? [item] : [...selectedItems, item]);
      }
    },
    [setSelectedItems, selectedItems],
  );

  const renderItems = React.useMemo(
    () =>
      filters?.map(
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
      ),
    [filters, selectedItems, handleItemClick],
  );

  return <>{renderItems}</>;
};

export default Sidebar;
