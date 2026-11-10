import type { CanParameters, MongoAbility } from '@casl/ability';

export type AppActions =
	| 'manage'
	| 'create'
	| 'list'
	| 'listWithAuthorship'
	| 'get'
	| 'getWithAuthorship'
	| 'update'
	| 'delete'
	| 'moderate';
export type AppSubjects =
	'User' | 'Category' | 'Unit' | 'Ingredient' | 'Drink' | 'Comment' | 'Rating' | 'all';

export type CommentSubject = { __typename: 'Comment'; userId: string };
export type RatingSubject = { __typename: 'Rating'; userId: string };

/** The subjects of the catalog: a partner changes only the records they created. */
export type CatalogSubjectName = 'Category' | 'Unit' | 'Ingredient' | 'Drink';
/** A catalog record, for the checks that depend on who created it. `createdBy` is gone once that account closes. */
export type CatalogRecordSubject<Name extends CatalogSubjectName = CatalogSubjectName> = {
	__typename: Name;
	createdBy?: string;
};

type OwnedSubjectName = 'Comment' | 'Rating';

export type AppAbilities =
	| [AppActions, Exclude<AppSubjects, OwnedSubjectName | CatalogSubjectName>]
	| [AppActions, 'Comment' | CommentSubject]
	| [AppActions, 'Rating' | RatingSubject]
	| [AppActions, 'Category' | CatalogRecordSubject<'Category'>]
	| [AppActions, 'Unit' | CatalogRecordSubject<'Unit'>]
	| [AppActions, 'Ingredient' | CatalogRecordSubject<'Ingredient'>]
	| [AppActions, 'Drink' | CatalogRecordSubject<'Drink'>]
	| [AppActions, CatalogRecordSubject]
	| ['manage', 'all'];

export type AppAbility = MongoAbility<AppAbilities>;
export type AppCanParameters = CanParameters<AppAbilities>;
