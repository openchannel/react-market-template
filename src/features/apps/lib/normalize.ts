// import { FullAppData } from '@openchannel/react-common-components';
import { FullAppData } from '@openchannel/react-common-components/dist/ui/common/models';
import type { Filter } from '@openchannel/react-common-components';
import { AppResponse } from '@openchannel/react-common-services';

import { pageConfig } from '../../../assets/config';
import { isNonEmpty } from '../../common/libs/helpers';
import type { NormalizedFilter } from '../types';

export const normalizeFilters = (source: Filter[]): NormalizedFilter[] => {
	return source
	.filter((f) => isNonEmpty(f.values))
	.flatMap((f) => f.values.map((v) => ({ ...v, valueId: v.id, filterId: f.id })));
};

export const normalizeAppData = (app: AppResponse) => new FullAppData(app, pageConfig.fieldMappings);
