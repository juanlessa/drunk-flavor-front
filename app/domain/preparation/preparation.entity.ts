import type { Translations } from '../shared/translations.types';
import type {
	GarnishStyles,
	GlassPreparationModes,
	IceKinds,
	Intensities,
	MixingVessels,
	PreparationActionTypes,
	RecipeLists,
	RimCoverages,
	ServingGlasses,
	StrainKinds,
	VesselRoles
} from './preparation.constants';

export type MixingVessel = (typeof MixingVessels)[keyof typeof MixingVessels];
export type ServingGlass = (typeof ServingGlasses)[keyof typeof ServingGlasses];
export type VesselRole = (typeof VesselRoles)[keyof typeof VesselRoles];
export type IceKind = (typeof IceKinds)[keyof typeof IceKinds];
export type Intensity = (typeof Intensities)[keyof typeof Intensities];
export type StrainKind = (typeof StrainKinds)[keyof typeof StrainKinds];
export type GarnishStyle = (typeof GarnishStyles)[keyof typeof GarnishStyles];
export type GlassPreparationMode =
	(typeof GlassPreparationModes)[keyof typeof GlassPreparationModes];
export type RimCoverage = (typeof RimCoverages)[keyof typeof RimCoverages];
export type RecipeList = (typeof RecipeLists)[keyof typeof RecipeLists];
export type PreparationActionType =
	(typeof PreparationActionTypes)[keyof typeof PreparationActionTypes];

/** Points at one recipe line: the ingredient plus the unit it is measured in, in one of the drink's lists. */
export type RecipeItemRef = {
	list: RecipeList;
	ingredientId: string;
	unitId?: string;
	/** When true the text names the item through its unit ("os gomos de limão") instead of by name alone. */
	withUnit?: boolean;
};

/** Prepares the serving glass: chill it, warm it, rinse it with a liquid or rim it. */
export type PrepareGlassAction =
	| {
			type: typeof PreparationActionTypes.prepareGlass;
			mode: typeof GlassPreparationModes.chill | typeof GlassPreparationModes.warm;
	  }
	| {
			type: typeof PreparationActionTypes.prepareGlass;
			mode: typeof GlassPreparationModes.rinse;
			item: RecipeItemRef;
	  }
	| {
			type: typeof PreparationActionTypes.prepareGlass;
			mode: typeof GlassPreparationModes.rim;
			item: RecipeItemRef;
			coverage?: RimCoverage;
	  };
/** Adds ingredients to a vessel. */
export type AddAction = {
	type: typeof PreparationActionTypes.add;
	target: VesselRole;
	items: RecipeItemRef[];
};
/** Adds ice to a vessel. */
export type AddIceAction = {
	type: typeof PreparationActionTypes.addIce;
	target: VesselRole;
	kind: IceKind;
};
/** Muddles what is in the mixing vessel. */
export type MuddleAction = { type: typeof PreparationActionTypes.muddle; intensity?: Intensity };
/** Shakes the mixing vessel. Whether it is a dry shake depends on the ice it holds at that point. */
export type ShakeAction = {
	type: typeof PreparationActionTypes.shake;
	intensity?: Intensity;
	seconds?: number;
};
/** Stirs what is in the mixing vessel, for a time or a number of revolutions. */
export type StirAction = {
	type: typeof PreparationActionTypes.stir;
	intensity?: Intensity;
	seconds?: number;
	revolutions?: number;
};
/**
 * Strains the mixing vessel. By default the drink goes to the serving glass. With `to: 'mixing'` the ice is
 * strained out and the liquid goes back to the mixing vessel (the first step of a reverse dry shake).
 */
export type StrainAction = {
	type: typeof PreparationActionTypes.strain;
	kind: StrainKind;
	to?: VesselRole;
	overIce?: boolean;
};
/** Tops the serving glass up with an ingredient. */
export type TopAction = { type: typeof PreparationActionTypes.top; item: RecipeItemRef };
/** Finishes the drink with garnishes, in a given style. */
export type GarnishAction = {
	type: typeof PreparationActionTypes.garnish;
	items: RecipeItemRef[];
	style?: GarnishStyle;
};
/**
 * Free text in each language, for anything the other actions cannot express yet. `items` declares the
 * recipe lines the text consumes and `into` says which vessel they end up in.
 */
export type CustomAction = {
	type: typeof PreparationActionTypes.custom;
	text: Translations<string>;
	items?: RecipeItemRef[];
	into?: VesselRole;
};

export type PreparationAction =
	| PrepareGlassAction
	| AddAction
	| AddIceAction
	| MuddleAction
	| ShakeAction
	| StirAction
	| StrainAction
	| TopAction
	| GarnishAction
	| CustomAction;

/**
 * How a drink is prepared: where, in what to serve it, and the ordered actions. It is plain data that refers to
 * the drink by ids, and the backend writes the method of every language from it.
 */
export type PreparationPlan = {
	mixingVessel: MixingVessel;
	servingGlass: ServingGlass;
	actions: PreparationAction[];
};
