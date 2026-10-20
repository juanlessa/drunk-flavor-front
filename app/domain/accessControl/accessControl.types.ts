import type { CanParameters, MongoAbility } from '@casl/ability';

export type AppActions = 'manage' | 'create' | 'list' | 'get' | 'update' | 'delete';

export type AppSubjects = 'User' | 'Category' | 'Ingredient' | 'Drink' | 'Comment' | 'all';

// Comment carries an ownership field so a member's update/delete can be scoped by owner.
// It mirrors the backend CommentPermissionModel ownership condition `{ user_id: { $eq } }`.
export type CommentSubject = { __typename: 'Comment'; user_id: string };

export type AppAbilities =
	| [AppActions, Exclude<AppSubjects, 'Comment'>]
	| [AppActions, 'Comment' | CommentSubject]
	| ['manage', 'all'];

export type AppAbility = MongoAbility<AppAbilities>;

export type AppCanParameters = CanParameters<AppAbilities>;
