export enum TextInputTypeEnum {
	text = 'text',
	number = 'number'
}

export type TextInputType = keyof typeof TextInputTypeEnum;
