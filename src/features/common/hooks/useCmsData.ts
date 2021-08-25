import * as React from 'react';
import { useDispatch } from 'react-redux';

import { fetchCmsContent } from '../store/cms-content';
import { useTypedSelector } from './useTypedSelector';

export const useCmsData = () => {
	const dispatch = useDispatch();
	const {
		isLoaded,
		isLoading,
		app,
		header,
		home,
		login,
		footer,
	} = useTypedSelector(({ cmsContent }) => cmsContent);

	React.useEffect(() => {
		if (!isLoaded && !isLoading) {
			dispatch(fetchCmsContent());
		}
	}, []);

	return {
		app,
		header,
		home,
		login,
		footer,
	};
};
