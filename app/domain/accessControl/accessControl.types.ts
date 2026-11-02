import type { CanParameters, MongoAbility } from '@casl/ability';

export type AppActions = 'manage' | 'create' | 'list' | 'get' | 'update' | 'delete' | 'moderate';
export type AppSubjects =
	'User' | 'Category' | 'Unit' | 'Ingredient' | 'Drink' | 'Comment' | 'Rating' | 'all';

export type CommentSubject = { __typename: 'Comment'; userId: string };
export type RatingSubject = { __typename: 'Rating'; userId: string };
type OwnedSubjectName = 'Comment' | 'Rating';

export type AppAbilities =
	| [AppActions, Exclude<AppSubjects, OwnedSubjectName>]
	| [AppActions, 'Comment' | CommentSubject]
	| [AppActions, 'Rating' | RatingSubject]
	| ['manage', 'all'];

export type AppAbility = MongoAbility<AppAbilities>;
export type AppCanParameters = CanParameters<AppAbilities>;
