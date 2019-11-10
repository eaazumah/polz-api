import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const ussd = {
	type: 'object',
	properties: {
		USERID: { type: 'string' },
		MSISDN: { type: 'string' },
		USERDATA: { type: 'string' },
		MSGTYPE: { type: 'boolean' }
	},
	required: [
		'USERID',
		'MSISDN',
		'USERDATA',
		'MSGTYPE'
	],
	additionalProperties: false
};

const ussdValidate = ajv.compile(ussd);
export const ussdValidator = (data: any) => {
	const valid = ussdValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: ussdValidate.errors };
};
