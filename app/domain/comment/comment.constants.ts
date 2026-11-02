export const CommentStatuses = {
	visible: 'visible',
	hidden: 'hidden',
	flagged: 'flagged'
} as const;

export const COMMENT_CONTENT_MIN_LENGTH = 1;
export const COMMENT_CONTENT_MAX_LENGTH = 2000;

/** Comments requested per page on the drink detail thread. */
export const DRINK_COMMENTS_PAGE_SIZE = 10;
