import { describe, expect, it } from 'vitest';
import { buildTranslatedNameQuery } from './query.helpers';

describe('query helpers', () => {
	it('searches and sorts on the name of the given locale', () => {
		expect(buildTranslatedNameQuery('gin', 'pt')).toEqual({
			search: { 'translations.pt.name': 'gin' },
			sort: { 'translations.pt.name': 1 }
		});
	});

	it('keeps the sort and drops the search for an empty term', () => {
		expect(buildTranslatedNameQuery('', 'en')).toEqual({
			search: undefined,
			sort: { 'translations.en.name': 1 }
		});
	});
});
