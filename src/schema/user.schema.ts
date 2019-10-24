import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createUserSchema = {
	type: 'object',
	properties: {
		phone: { type: 'string' },
		firstName: { type: 'string' },
		lastName: { type: 'string' },
		email: { format: 'email' },
		password: { type: 'string' }
	},
	additionalProperties: false,
	required: [
		'phone',
		'firstName',
		'lastName',
		'password'
	]
};

const updateUserSchema = {
	type: 'object',
	properties: {
		phone: { type: 'string' },
		firstName: { type: 'string' },
		lastName: { type: 'string' },
		email: { format: 'email' },
		password: { type: 'string' }
	},
	additionalProperties: false,
	required: [
		'id'
	]
};

const createUserValidate = ajv.compile(createUserSchema);
export const createUserValidator = (data: any) => {
	const valid = createUserValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createUserValidate.errors };
};

const updateUserValidate = ajv.compile(updateUserSchema);
export const updateUserValidator = (data: any) => {
	const valid = updateUserValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: updateUserValidate.errors };
};
