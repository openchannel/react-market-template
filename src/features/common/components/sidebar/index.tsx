import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcSidebar, SidebarClick } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { QueryUtil } from '@openchannel/react-common-services';
import { useTypedSelector } from '../../hooks';

export const Sidebar: React.FC = () => {
  const history = useHistory();
  const [selectedCollections, setSelectedCollections] = React.useState<SidebarClick>({ parent: {}, child: {} });
  const [selectedCategories, setSelectedCategories] = React.useState<SidebarClick>({ parent: {}, child: {} });
  const { filters } = useTypedSelector(({ apps }) => apps);
  const [allCategories, setAllCategories] = React.useState({ parent: selectedCollections.parent, child: [] });

  const selectedFilterQueries = [allCategories.parent, ...allCategories.child]
    .map((filterValue) => filterValue.query)
    .filter((q) => q);
  const filtersQuery = QueryUtil.getAndQuery(selectedFilterQueries as string[]);

  // console.log('all Filters', filters);
  console.log('checked Filters', allCategories);
  // console.log('filtersQuery is for the query to the backend', filtersQuery);

  const filterValues: any[] = [allCategories.parent, ...allCategories.child].map((filterItem: any) => ({
    filterId: filterItem.parentId,
    value: filterItem,
  }));
  // console.log('filterValues for query building', filterValues);

  const urlFilterData: any = {};

  filterValues.forEach((filterValue: any) => {
    const values = urlFilterData[filterValue.filterId] as string[];
    urlFilterData[filterValue.filterId] = values ? [...values, filterValue.value.id] : [filterValue.value.id];
  });

  const urlFilterDataKeys = Object.keys(urlFilterData);
  urlFilterDataKeys.forEach((key) => {
    urlFilterData[key] = (urlFilterData[key] as string[]).join(',');
  });
  // console.log('url filter data', urlFilterData);

  const browserQuery = () => {
    const searchParams = [];
    for (const [key, value] of Object.entries(urlFilterData)) {
      searchParams.push(QueryUtil.safe(key, value));
    }
    return QueryUtil.params(...searchParams);
  };
  // console.log('browser query search params', browserQuery());
  console.log(history.location.pathname);
  const newBrowserQuery = `/${history.location.pathname.split('/')[1]}${browserQuery()}`;
  console.log('newBrowserQuery', newBrowserQuery);

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
            subArray.values = undefined;
          }
        });
        return item?.id === 'collections' ? (
          <OcSidebar
            sidebarModel={item.values}
            title={item.name}
            key={item.id}
            baseNavigation={`/browse/${item.id}`}
            navigate={(to: string) => history.replace(to)}
            onClickSidebar={handleCollectionsClick}
          />
        ) : item?.id === 'categories' ? (
          <OcSidebar
            sidebarModel={item.values}
            title={item.name}
            key={item.id}
            baseNavigation={`/browse/${item.id}`}
            navigate={(to: string) => history.replace(to)}
            onClickSidebar={handleCategoriesClick}
          />
        ) : undefined;
      }),
    [filters, selectedCategories, selectedCollections],
  );

  React.useEffect(() => {
    Object.keys(allCategories.parent).length > 0 && allCategories.child.length > 0
      ? history.replace(newBrowserQuery)
      : undefined;
  }, [allCategories.parent, allCategories.child]);

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
