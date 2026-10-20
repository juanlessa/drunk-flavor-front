export type StrengthCriterion = 'length' | 'lowercase' | 'uppercase' | 'digit' | 'special';

export type StrengthLevel = 'weak' | 'medium' | 'strong';

export const hasMinMaxLength = (password: string): boolean =>
	password.length >= 8 && password.length <= 64;

export const hasLowercase = (password: string): boolean => /[a-z]/.test(password);

export const hasUppercase = (password: string): boolean => /[A-Z]/.test(password);

export const hasDigit = (password: string): boolean => /\d/.test(password);

export const hasSpecialChar = (password: string): boolean =>
	/[!@#$%^&*()_+=\-{}[\]:;"'<>,.?/~`]/.test(password);

export const STRENGTH_CRITERIA: {
	key: StrengthCriterion;
	test: (password: string) => boolean;
}[] = [
	{ key: 'length', test: hasMinMaxLength },
	{ key: 'lowercase', test: hasLowercase },
	{ key: 'uppercase', test: hasUppercase },
	{ key: 'digit', test: hasDigit },
	{ key: 'special', test: hasSpecialChar }
];

export const countMetCriteria = (password: string): number =>
	STRENGTH_CRITERIA.reduce((met, criterion) => met + (criterion.test(password) ? 1 : 0), 0);

// Strength thresholds over the 5 strength criteria (bar color only):
//   met <= 2          -> weak   (danger)
//   met === 3 || 4    -> medium (warning)
//   met === 5         -> strong (success)
export const levelFromMet = (met: number): StrengthLevel => {
	if (met >= 5) {
		return 'strong';
	}
	if (met >= 3) {
		return 'medium';
	}
	return 'weak';
};

export const computeStrength = (password: string): { met: number; level: StrengthLevel } => {
	const met = countMetCriteria(password);
	return { met, level: levelFromMet(met) };
};
