import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createVoteSchema = {
	type: 'Object',
	properties: {
		pollId: { type: 'number' },
		categoryId: { type: 'number' },
		participantId: { type: 'number' },
		paymentAccountType: { type: 'string' },
		paymentAccountId: { type: 'string' },
		email: { format: 'email' },
		voucher: { type: 'string' },
		units: { type: 'number' },
		phone: { type: 'string' }
	},
	required: [
		'categoryId',
		'participantId',
		'paymentAccountType',
		'paymentAccountId',
		'units',
		'phone'
	],
	additionalProperties: false
};

// const updateVoteSchema = {
// 	type: 'Object',
// 	properties: {
// 		id: { type: 'string' },
// 		categoryId: { type: 'string' },
// 		participantId: { type: 'string' },
// 		status: { type: 'string' },
// 		units: { type: 'number' },
// 		phone: { type: 'string' }
// 	},
// 	required: [
// 		'id'
// 	],
// 	additionalProperties: false
// };

const createVoteValidate = ajv.compile(createVoteSchema);
export const createVoteValidator = (data: any) => {
	const valid = createVoteValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createVoteValidate.errors };
};

// const updateVoteValidate = ajv.compile(updateVoteSchema);
// export const updateVoteValidator = (data: any) => {
// 	const valid = updateVoteValidate(data);
// 	if (valid) return { valid, data };
// 	else return { valid, error: updateVoteValidate.errors };
// };
