import { z } from 'zod/v4';
import { validateSchema } from '~/helpers/validateSchema';
import type { RequestOwnershipTransferForm } from '~/types/ownershipTransfer.types';
import { userAdministrationReasonValidation } from './user';

// schemas
export const requestOwnershipTransferFormSchema = z.object({
	reason: userAdministrationReasonValidation
});

//validators
export const requestOwnershipTransferFormValidator = validateSchema<RequestOwnershipTransferForm>(
	requestOwnershipTransferFormSchema
);
