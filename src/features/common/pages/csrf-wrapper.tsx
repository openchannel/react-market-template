import * as React from 'react';
import { auth } from '@openchannel/react-common-services';

type CsrfWrapper = {
	children: JSX.Element;
}

export const CsrfWrapper: React.FC<CsrfWrapper> = (props) => {
	const [isLoaded, setIsLoaded] = React.useState(false);

	React.useEffect(() => {
		const fetchCsrf = async () => {
			try {
				await auth.initCsrf();
				setIsLoaded(true)
			} catch (error) {
				console.error('error', error);
			}
		}

		fetchCsrf();
	}, []);

	if (!isLoaded) {
		return (
			<div className="bg-container">Loading...</div>
		);
	}

	return props.children;
};
