export type ApiResponse<T> = T extends Date
	? string
	: T extends readonly (infer Item)[]
		? ApiResponse<Item>[]
		: T extends object
			? { [Key in keyof T]: ApiResponse<T[Key]> }
			: T;
