import type { Language } from '~/domain/shared/translations.types';

const DATE_LOCALES: Record<Language, string> = { en: 'en-US', pt: 'pt-BR' };

const toIntlLocale = (locale: string): string => DATE_LOCALES[locale as Language] ?? locale;

const RELATIVE_STEPS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
	{ unit: 'year', seconds: 365 * 24 * 60 * 60 },
	{ unit: 'month', seconds: 30 * 24 * 60 * 60 },
	{ unit: 'week', seconds: 7 * 24 * 60 * 60 },
	{ unit: 'day', seconds: 24 * 60 * 60 },
	{ unit: 'hour', seconds: 60 * 60 },
	{ unit: 'minute', seconds: 60 }
];

/**
 * Short relative time in the given locale, past or future ("now", "5 minutes ago", "yesterday",
 * "in 18 hours"). Anything within a minute either way (e.g. clock skew) reads as "now".
 */
export const formatRelativeTime = (
	date: Date | string,
	locale: string,
	now: Date = new Date()
): string => {
	const formatter = new Intl.RelativeTimeFormat(toIntlLocale(locale), { numeric: 'auto' });
	const diffSeconds = Math.round((new Date(date).getTime() - now.getTime()) / 1000);
	const distance = Math.abs(diffSeconds);
	const step = RELATIVE_STEPS.find(({ seconds }) => distance >= seconds);
	if (!step) return formatter.format(0, 'second');
	return formatter.format(
		Math.sign(diffSeconds) * Math.floor(distance / step.seconds),
		step.unit
	);
};

/** Full date and time in the given locale, e.g. for a `title` next to a relative time. */
export const formatDateTime = (date: Date | string, locale: string): string =>
	new Intl.DateTimeFormat(toIntlLocale(locale), { dateStyle: 'long', timeStyle: 'short' }).format(
		new Date(date)
	);
