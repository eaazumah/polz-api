import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

const createVoteSchema = {
	type: 'object',
	properties: {
		pollId: { type: 'number' },
		categoryId: { type: 'number' },
		participantId: { type: 'number' },
		paymentOption: {
			enum: [
				'MTN',
				'AIRTELTIGO',
				'VODAFONE'
			]
		},
		walletNumber: { type: 'string' },
		email: { format: 'email' },
		voucherCode: { type: 'string' },
		units: { type: 'number' },
		amount: { type: 'number' },
		phone: { type: 'string' }
	},
	required: [
		'pollId',
		'categoryId',
		'participantId',
		'paymentOption',
		'walletNumber',
		'units',
		'phone'
	],
	additionalProperties: false
};

const reddeCallbackSchema = {
	type: 'object',
	properties: {
		reason: { type: 'string' },
		clienttransid: { type: 'string' },
		clientreference: { type: 'string' },
		telcotransid: { type: 'string' },
		transactionid: { type: 'number' },
		statusdate: { type: 'string' },
		status: {
			enum: [
				'PAID',
				'PROGRESS',
				'FAILED',
				'PENDING'
			]
		}
	},
	required: [
		'status'
	]
};

const createVoteValidate = ajv.compile(createVoteSchema);
export const createVoteValidator = (data: any) => {
	const valid = createVoteValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: createVoteValidate.errors };
};

const reddeCallbackValidate = ajv.compile(reddeCallbackSchema);
export const reddeCallbackValidator = (data: any) => {
	const valid = reddeCallbackValidate(data);
	if (valid) return { valid, data };
	else return { valid, error: reddeCallbackValidate.errors };
};

// const updateVoteValidate = ajv.compile(updateVoteSchema);
// export const updateVoteValidator = (data: any) => {
// 	const valid = updateVoteValidate(data);
// 	if (valid) return { valid, data };
// 	else return { valid, error: updateVoteValidate.errors };
// };
