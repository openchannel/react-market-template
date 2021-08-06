import * as React from 'react';
import { toast } from 'react-toastify';

export const Msg = (props: any): JSX.Element => {
  const { toastProps, closeToast } = props;
  return (
    <div>
      Lorem ipsum dolor {toastProps.position}
      <button>Retry</button>
      <button onClick={closeToast}>Close</button>
    </div>
  );
};

//example: const displayMsg = () => {
//   toast(<Msg />);
//   // toast(Msg) would also work
// };
