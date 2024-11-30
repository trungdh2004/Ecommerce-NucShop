export const setItemLocal = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value));
};
export const getItemLocal = <T>(key: string) => {
	const item = localStorage.getItem(key);
	return item ? (JSON.parse(item) as T) : null;
};
export const removeItemLocal = (key: string): void => {
	localStorage.removeItem(key);
};
