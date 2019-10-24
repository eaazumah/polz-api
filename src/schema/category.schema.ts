import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createCategorySchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		title: { type: 'string' },
		pollId: { type: 'string' }
	},
	required: [
		'id',
		'title',
		'pollId'
	],
	additionalProperties: false
};

const updateCategorySchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		name: { type: 'string' },
		pollId: { type: 'string' }
	},
	required: [
		'id'
	],
	additionalProperties: false
};

const createCategoryValidate = ajv.compile(createCategorySchema);
export const createCategoryValidator = (data: any) => {
	const valid = createCategoryValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createCategoryValidate.errors };
};

const updateCategoryValidate = ajv.compile(updateCategorySchema);
export const updateCategoryValidator = (data: any) => {
	const valid = updateCategoryValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: updateCategoryValidate.errors };
};
