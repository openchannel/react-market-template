import {
	auth,
	axiosRequest,
	interceptors,
	storage,
	InterceptorError,
} from '@openchannel/react-common-services';

import { notify } from '../../molecules';

let isRefreshing = false;
let skipByErrorCode: number[] = [];

// eslint-disable-next-line
const process401Error = async (request: any) => {
	console.log('process401Error')
	if (!isRefreshing) {
		isRefreshing = true;

		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const { data } = await auth.refreshToken({ refreshToken: storage.getRefreshToken() });

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			storage.persist(data);
			isRefreshing = false;
			return axiosRequest(request);

		} catch (error) {
			storage.removeTokens();
			isRefreshing = false;
			//navigate
			throw error;
		}
	} else {
		return axiosRequest(request);
	}
};

const isCsrfError = ({ response }: InterceptorError) => {
	return response?.status === 403 && response?.data?.error?.toLowerCase()?.includes('csrf');
};

const processError = (response: InterceptorError['response']) => {
	if (!response) return null;

	let errorMessage: string;
	const { data, status } = response;

	if (data.error?.message) {
		errorMessage = `Error Code: ${data.status}\nMessage: ${response.data.message}`;
	} else if (status === 403) {
		errorMessage = `Error Code: ${status}\nYou are not authorized to perform this action`;
	} else {
		errorMessage = `Error Code: ${status}\nMessage: ${data.message}`;
	}

	skipByErrorCode = [];

	notify.error(errorMessage);
};

// eslint-disable-next-line
const errorHandler = (error: InterceptorError): Promise<any> | InterceptorError => {
	const data = error.response?.data;
	const config = error.response?.config;
	const status = error.response?.status;

	if (status === 401 && !config?.url?.includes('refresh')) {
		return process401Error(error?.request);
	}

	if (data?.['validation-errors'] || (data?.errors?.length >= 1 && data?.errors[0]?.field)) {
		throw error;
	}

	if (isCsrfError(error)) {
		throw error;
	}

	const shouldShowToast = !skipByErrorCode.includes(status || 0);
	if (shouldShowToast) {
		processError(error.response);
	}

	throw error;
}

interceptors.request.use(
	(request) => {
		const errorHeader = request.headers['x-handle-error'];
		skipByErrorCode = errorHeader ? errorHeader.split(',').map(Number) : [];
		delete request.headers['x-handle-error'];

		return request;
	},
);

interceptors.response.use(
	(response) => response,
	errorHandler,
);
