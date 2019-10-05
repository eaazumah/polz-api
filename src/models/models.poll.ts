import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

const pollSchema = {
	type: "object",
	properties: {
		id: { type: "string" },
		code: { type: "string" },
		name: { type: "string" },
		about: { type: "string" },
		expiryDate: { format: "date-time" },
		categories: {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: { type: "string" },
					participants: {
						type: "array",
						items: {
							type: "object",
							properties: {
								name: { type: "string" }
							}
						}
					}
				}
			}
		}
	},
	required: [
		"id",
		"code"
	],
	additionalProperties: false
};

const pollValidate = ajv.compile(pollSchema);
export const pollValidator = (data: any) => {
	const valid = pollValidate(data);
	if (valid) return { valid: valid, data: data };
	else return { valid: valid, error: pollValidate.errors };
};
