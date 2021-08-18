export const isEmpty = <T>(value: T) => {
	if (typeof value === 'string') return value.length === 0;
	if (typeof value === 'number') return value === 0;
	if (Array.isArray(value)) return value.length === 0;
	return !value;
}

export const isNonEmpty = <T>(value: T) => {
	return !isEmpty(value);
};
