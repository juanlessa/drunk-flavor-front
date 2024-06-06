enum TextInputTypeEnum {
	text = 'text',
	number = 'number'
}

export type TextInputType = keyof typeof TextInputTypeEnum;

export const textInputTypeOptions = Object.keys(TextInputTypeEnum) as TextInputType[];
