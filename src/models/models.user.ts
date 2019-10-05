import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

const userSchema = {
	type: "object",
	properties: {
		id: { type: "string" },
		phone: { type: "string" },
		firstName: { type: "string" },
		lastName: { type: "string" },
		email: { type: "string" },
		balance: { type: "number" },
		accountType: { type: "string" },
		password: { type: "string" }
	},
	additionalProperties: false,
	required: [
		"phone",
		"firstName",
		"lastName",
		"password"
	]
};

const userValidate = ajv.compile(userSchema);
export const userValidator = (data: any) => {
	const valid = userValidate(data);
	if (valid) return { valid: valid, data: data };
	else return { valid: valid, error: userValidate.errors };
};
