export type EntityMetadata = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

/**
 * Who created a record and who changed it last, as user ids. Only the reads with authorship (`/me`) carry them, for
 * the people who contribute to the catalog; the public reads leave them out. Either is absent when that account
 * was closed.
 */
export type AuthorshipMetadata = {
	createdBy?: string;
	updatedBy?: string;
};

export type Authored<T> = T & AuthorshipMetadata;
