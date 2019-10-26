import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createParticipantSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		image: { type: 'string' },
		categoryId: { type: 'number' }
	},
	required: [
		'name',
		'categoryId'
	],
	additionalProperties: false
};

const updateParticipantSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		image: { type: 'string' },
		categoryId: { type: 'number' }
	},

	additionalProperties: false
};

const createParticipantValidate = ajv.compile(createParticipantSchema);
export const createParticipantValidator = (data: any) => {
	const valid = createParticipantValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createParticipantValidate.errors };
};

const updateParticipantValidate = ajv.compile(updateParticipantSchema);
export const updateParticipantValidator = (data: any) => {
	const valid = updateParticipantValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: updateParticipantValidate.errors };
};
