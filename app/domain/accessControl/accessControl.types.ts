import type { CanParameters, MongoAbility } from '@casl/ability';

export type AppActions = 'manage' | 'create' | 'list' | 'get' | 'update' | 'delete' | 'moderate';
export type AppSubjects =
	'User' | 'Category' | 'Unit' | 'Ingredient' | 'Drink' | 'Comment' | 'Rating' | 'all';

// Comment and Rating carry an ownership field so a user's update/delete can be scoped by
// owner. They mirror the backend permission models' ownership condition `{ user_id: { $eq } }`.
export type CommentSubject = { __typename: 'Comment'; user_id: string };
export type RatingSubject = { __typename: 'Rating'; user_id: string };

type OwnedSubjectName = 'Comment' | 'Rating';

export type AppAbilities =
	| [AppActions, Exclude<AppSubjects, OwnedSubjectName>]
	| [AppActions, 'Comment' | CommentSubject]
	| [AppActions, 'Rating' | RatingSubject]
	| ['manage', 'all'];

export type AppAbility = MongoAbility<AppAbilities>;

export type AppCanParameters = CanParameters<AppAbilities>;
