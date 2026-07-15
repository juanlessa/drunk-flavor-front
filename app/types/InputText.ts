export enum InputTextTypeEnum {
	text = 'text',
	email = 'email'
}

export type InputTextType = keyof typeof InputTextTypeEnum;
