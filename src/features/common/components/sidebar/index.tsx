import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarClick } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { QueryUtil } from '@openchannel/react-common-services';
import { useTypedSelector } from '../../hooks';
import queryString from 'querystring';

const BROWSE = 'browse';

export const Sidebar: React.FC = () => {
  const history = useHistory();
  const [selectedCollections, setSelectedCollections] = React.useState<SidebarClick>({ parent: {}, child: {} });
  const [selectedCategories, setSelectedCategories] = React.useState<SidebarClick>({ parent: {}, child: {} });
  const { filters } = useTypedSelector(({ apps }) => apps);
  const [allCategories, setAllCategories] = React.useState<any>({ parent: {}, child: [] });

  const selectedFilterQueries = [allCategories.parent, ...allCategories.child]
    .map((filterValue) => filterValue?.query)
    .filter((q) => q);
  const filtersQuery = QueryUtil.getAndQuery(selectedFilterQueries as string[]);

  const filterValues: any[] = [allCategories.parent, ...allCategories.child].map((filterItem: any) => ({
    filterId: filterItem?.parentId,
    value: filterItem,
  }));

  const urlFilterData: any = {};

  filterValues.forEach((filterValue: any) => {
    const values = urlFilterData[filterValue?.filterId] as string[];
    urlFilterData[filterValue?.filterId] = values ? [...values, filterValue?.value?.id] : [filterValue?.value?.id];
  });

  const urlFilterDataKeys = Object.keys(urlFilterData);
  urlFilterDataKeys.forEach((key) => {
    urlFilterData[key] = (urlFilterData[key] as string[]).join(',');
  });

  const browserQuery = () => {
    const searchParams = [];
    for (const [key, value] of Object.entries(urlFilterData)) {
      searchParams.push(QueryUtil.safe(key, value));
    }
    return QueryUtil.params(...searchParams);
  };

  const handleCollectionsClick = (item: SidebarClick) => {
    if (allCategories.parent.id === item.parent?.id) {
      setAllCategories({ parent: {}, child: allCategories.child });
      setSelectedCategories({ parent: {} });
    } else {
      setSelectedCollections(item);

      setAllCategories({ parent: item.parent, child: allCategories.child });
    }
  };

  const handleCategoriesClick = (item: SidebarClick) => {
    const newChild = [...allCategories.child];

    if (allCategories.child.includes(item.parent as never)) {
      const index = allCategories.child.indexOf(item.parent as never);
      newChild.splice(index, 1);
      setAllCategories({ parent: allCategories.parent, child: newChild });
      setSelectedCategories({ parent: {}, child: {} });
    } else {
      setSelectedCategories(item);
      newChild.push(item.parent as never);
      setAllCategories({ parent: allCategories.parent, child: newChild });
    }
  };

  const renderFilters = React.useMemo(
    () =>
      filters?.map((item: { values: any[]; id: React.Key | null | undefined; name: string | undefined }) => {
        item?.values?.map((subArray: any) => {
          subArray.parentId = item.id;
          if (!subArray?.values?.length) {
            subArray.fullHref = `/${BROWSE}/${item.id}/${subArray.id}`;
            subArray.checked = false;
          }
        });
        return item?.id === 'collections' ? (
          <OcSidebar
            sidebarModel={item.values}
            title={item.name}
            key={item.id}
            baseNavigation={`/${BROWSE}/${item.id}`}
            navigate={(to: string) => history.replace(to)}
            selectedCategory={selectedCollections}
            onClickSidebar={handleCollectionsClick}
          />
        ) : item?.id === 'categories' ? (
          <OcSidebar
            sidebarModel={item.values}
            title={item.name}
            key={item.id}
            baseNavigation={`/${BROWSE}/${item.id}`}
            navigate={(to: string) => history.replace(to)}
            selectedCategory={selectedCategories}
            onClickSidebar={handleCategoriesClick}
          />
        ) : undefined;
      }),
    [filters, selectedCategories, selectedCollections],
  );

  React.useEffect(() => {
    if (
      (Object.keys(allCategories?.parent).length > 0 && allCategories?.child?.length > 0) ||
      (allCategories.child?.length > 1 && Object.keys(allCategories?.parent)?.length < 1)
    ) {
      history.replace(`/${history.location.pathname.split('/')[1]}${browserQuery()}`);
    } else if (Object.keys(allCategories.parent).length > 0 && allCategories.child.length < 1) {
      history.replace(allCategories.parent?.fullHref);
    } else if (allCategories.child.length === 1 && Object.keys(allCategories.parent).length < 1) {
      history.replace(allCategories.child[0]?.fullHref);
    } else if (allCategories.child.length < 1 && Object.keys(allCategories.parent).length < 1) {
      history.replace('/');
    }
  }, [allCategories.parent, allCategories.child]);

  React.useEffect(() => {
    const path = history.location.pathname;
    const search = history.location.search;

    const [type, id] = path.split('/').filter((p) => p !== BROWSE && !!p);
    if (type) {
      const filter = filters
        .filter((f: any) => f.id === type)
        .flatMap((f: any) => f.values)
        .filter((v: any) => v.id === id);

      if (filter && filter[0]) {
        if (type === 'collections') {
          setAllCategories({ parent: filter[0], child: [] });
          setSelectedCollections({ parent: filter[0], child: {} });
        } else {
          setAllCategories({ parent: {}, child: [filter[0]] });
          setSelectedCategories({ parent: filter[0] });
        }
      }
    } else if (search.length > 0) {
      const query: any = Object.entries(queryString.parse(search.replace(/^\?/, ''))).reduce(
        (obj: any, [key, value]) => {
          obj[key] = !value ? value : Array.isArray(value) ? value : value.split(',');
          return obj;
        },
        {},
      );
      const filter = filters.flatMap((f: any) => f.values);
      const itemsToPush = Object.entries(query).reduce((obj: any, [key, value]) => {
        (value as string[]).length > 1
          ? (obj[key] = filter.filter(function (e: any) {
              return (value as string[]).indexOf(e.id) !== -1;
            }, filter))
          : (obj[key] = filter.filter((fi: any) => fi.id === (value as string[])[0]));

        return obj;
      }, {});
      setAllCategories({ parent: itemsToPush.collections || {}, child: [...itemsToPush.categories] || [] });
    }
  }, [filters]);
  console.log(allCategories);

  return (
    <>
      {/* <oc-text-search class="mb-3" (enterSearch)="catchSearchText($event)"></oc-text-search> 
      <app-collapse-with-title titleForClose="Close filter options"
      titleForOpen="Open filter options"
      [collapsed]="filterCollapsed"
      (collapseChanged)="onCollapseChanged($event)">
    </app-collapse-with-title> */}
      {renderFilters}
    </>
  );
};

export default Sidebar;
