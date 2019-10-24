import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createPollSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		about: { type: 'string' },
		unitCost: { type: 'number' },
		userId: { type: 'number' },
		expired: { type: 'boolean' },
		freePoll: { type: 'boolean' },
		expiryDate: { format: 'date-time' }
	},
	required: [
		'name',
		'expiryDate',
		'userId'
	],
	additionalProperties: false
};

const updatePollSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		about: { type: 'string' },
		unitCost: { type: 'number' },
		expired: { type: 'boolean' },
		freePoll: { type: 'boolean' },
		expiryDate: { format: 'date-time' }
	},
	required: [
		'id'
	],
	additionalProperties: false
};

const createPollValidate = ajv.compile(createPollSchema);
export const createPollValidator = (data: any) => {
	const valid = createPollValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createPollValidate.errors };
};

const updatePollValidate = ajv.compile(updatePollSchema);
export const updatePollValidator = (data: any) => {
	const valid = updatePollValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: updatePollValidate.errors };
};
