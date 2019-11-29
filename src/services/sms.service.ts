const axios = require('axios').default;

const encodeGetParams = (p: object) =>
	Object.entries(p).map((kv) => kv.map(encodeURIComponent).join('=')).join('&');

export const sendSms = (msg: string, recipient: string) => {
	const sender = 'Polz';
	const clientKey = '3a31f53157760a1';
	const clientSecret = '0411c91d365a';
	const baseUrl = 'https://api.mobiforte.com/sms';

	const params = {
		recipient,
		sender_id: sender,
		message: msg,
		client_id: clientKey,
		client_secret: clientSecret
	};
	const url = baseUrl + encodeGetParams(params);
	axios({
		method: 'get',
		url
	})
		.then((result: any) => {
			// tslint:disable-next-line: no-console
			console.log(result);
		})
		.catch(() => {});
};
