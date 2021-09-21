import * as React from 'react';
import { OcButtonComponent } from '@openchannel/react-common-components/dist/ui/common/atoms/oc-button';
import { ViewData } from './types';
/* <app-button-action *ngFor="let action of appListingActions"
      [appData]="app"
      [buttonAction]="action"
      (updateAppData)="getAppData()"
      className="action-button"
    />  Example of usage */

export interface ActionButtonProps {
  viewData: ViewData;
  inProcess: boolean;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { viewData, inProcess, onClick } = props;

  return (
    <OcButtonComponent
      type="none"
      customClass={viewData?.button?.class}
      text={viewData?.button?.text}
      process={inProcess}
      disabled={inProcess}
      onClick={onClick}
    />
  );
};

export default ActionButton;
