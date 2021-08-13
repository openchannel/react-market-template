import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OcGetStartedComponent } from '@openchannel/react-common-components/dist/common/molecules';
import getStartedImg from '../../../../assets/img/get-started.svg';

export const GetStarted = () => {
  return (
    <div className="bg-container mt-5 py-8 min-height-auto">
      <div className="container">
        <OcGetStartedComponent
          getStartedType="home"
          getStartedHeader="List your app in our app directory"
          getStartedDescription="Register as an app developer and submit your app easily with our Developer Portal"
          getStartedButtonText="Get started as an app developer"
          getStartedImage={getStartedImg}
        />
      </div>
    </div>
  );
};

export default GetStarted;
