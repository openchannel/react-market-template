import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcSidebar } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { getFilters } from '../../../apps/store/apps/actions';
import { useTypedSelector } from '../../hooks';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { filters } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    dispatch(getFilters());
  }, []);

  const [upperLevelCategory, setUpperLevelCategory] = React.useState('');
  const [lowerLevelCategory, setLowerLevelCategory] = React.useState([]);

  const renderFilters = React.useMemo(
    () =>
      filters.map((item: any, index: number) => {
        item.values.filter((subArray: any) => {
          if (!subArray.values.length) {
            subArray.values = undefined;
          }
        });
        return (
          <OcSidebar
            sidebarModel={item.values}
            title={item.name}
            key={item.name + index}
            baseNavigation={`browse/${item.id}`}
          />
        );
      }),
    [filters],
  );

  // const sidebarItemOnclick = getQuery from query builder from services
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
//need to render tag in search string
//every item of sidebar is links redirecting to search page with search query gotten from query builder
//
