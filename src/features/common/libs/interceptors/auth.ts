import { storage, interceptors } from '@openchannel/react-common-services';

interceptors.request.use((request) => {
  const token = storage.getAccessToken();

  if (token && request.baseURL!.startsWith(process.env.REACT_APP_API_URL!)) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});
