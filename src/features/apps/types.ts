import { FullAppData, FilterValue } from '@openchannel/react-common-components';

export interface NormalizedFilter extends FilterValue {
	valueId?: string;
	filterId?: string;
}

export interface Gallery extends NormalizedFilter {
	data: FullAppData[];
}
