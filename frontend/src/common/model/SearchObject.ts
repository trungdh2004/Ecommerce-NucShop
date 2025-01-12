/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseSearchObject {
	pageIndex = 1;
	pageSize = 10;
	keyword = null;

	constructor(value: any) {
		Object.assign(this, value);
	}
}
