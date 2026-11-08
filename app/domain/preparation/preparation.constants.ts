// Mirrors the vocabulary of the backend preparation module. The values are what the API sends and receives.

/** Where the drink is prepared. `serving_glass` means the drink is built directly in the glass. */
export const MixingVessels = {
	shaker: 'shaker',
	mixingGlass: 'mixing_glass',
	pitcher: 'pitcher',
	servingGlass: 'serving_glass'
} as const;
export const mixingVessels = Object.values(MixingVessels);

export const ServingGlasses = {
	martini: 'martini',
	coupe: 'coupe',
	nickAndNora: 'nick_and_nora',
	flute: 'flute',
	highball: 'highball',
	collins: 'collins',
	rocks: 'rocks',
	doubleRocks: 'double_rocks',
	hurricane: 'hurricane',
	copperMug: 'copper_mug',
	wine: 'wine',
	shot: 'shot',
	snifter: 'snifter',
	julepCup: 'julep_cup',
	tikiMug: 'tiki_mug',
	heatproofMug: 'heatproof_mug'
} as const;
export const servingGlasses = Object.values(ServingGlasses);

/** Actions refer to vessels by role, so a built drink (mixing === serving) needs no special casing. */
export const VesselRoles = {
	mixing: 'mixing',
	serving: 'serving'
} as const;
export const vesselRoles = Object.values(VesselRoles);

export const IceKinds = {
	cubes: 'cubes',
	crushed: 'crushed',
	largeCube: 'large_cube',
	sphere: 'sphere'
} as const;
export const iceKinds = Object.values(IceKinds);

export const Intensities = {
	gentle: 'gentle',
	normal: 'normal',
	vigorous: 'vigorous'
} as const;
export const intensities = Object.values(Intensities);

/** `none` means pouring without a strainer. */
export const StrainKinds = {
	single: 'single',
	double: 'double',
	fine: 'fine',
	none: 'none'
} as const;
export const strainKinds = Object.values(StrainKinds);

/**
 * How a garnish is put on the drink. `express` and `flame` release the oils of a citrus peel over the drink
 * (`flame` passes them through a flame first); the peel is then used as the garnish, or thrown away when the
 * style says so.
 */
export const GarnishStyles = {
	express: 'express',
	expressAndDiscard: 'express_and_discard',
	flame: 'flame',
	flameAndDiscard: 'flame_and_discard',
	skewer: 'skewer',
	rimPerch: 'rim_perch',
	float: 'float',
	sprinkle: 'sprinkle'
} as const;
export const garnishStyles = Object.values(GarnishStyles);

/** What `prepare_glass` does to the serving glass. */
export const GlassPreparationModes = {
	chill: 'chill',
	warm: 'warm',
	rinse: 'rinse',
	rim: 'rim'
} as const;
export const glassPreparationModes = Object.values(GlassPreparationModes);

export const RimCoverages = {
	full: 'full',
	half: 'half'
} as const;
export const rimCoverages = Object.values(RimCoverages);

/** The two lists of a drink an action can take items from. */
export const RecipeLists = {
	ingredients: 'ingredients',
	garnishes: 'garnishes'
} as const;
export const recipeLists = Object.values(RecipeLists);

/** The `type` of each action of a plan. */
export const PreparationActionTypes = {
	prepareGlass: 'prepare_glass',
	add: 'add',
	addIce: 'add_ice',
	muddle: 'muddle',
	shake: 'shake',
	stir: 'stir',
	strain: 'strain',
	top: 'top',
	garnish: 'garnish',
	custom: 'custom'
} as const;
export const preparationActionTypes = Object.values(PreparationActionTypes);
