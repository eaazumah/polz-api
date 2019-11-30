import { Poll } from '../models/poll.model';

const getNewCode = () =>
	new Promise((resolve, reject) => {
		Poll.findAll({
			attributes: [
				'code'
			]
		})
			.then((polls) => {
				const codes = polls.map((item) => parseInt(item.code, 10)).filter(Number);
				if (codes.length < 1 || codes === undefined) {
					resolve({ code: 1 });
				} else {
					codes.sort();
					const missing: number[] = [];
					for (let i = 1; i < codes.length; i++) {
						if (codes.indexOf(i) === -1) {
							missing.push(i);
						}
					}
					if (missing.length < 1 || missing === undefined) {
						resolve({ code: codes[codes.length - 1] + 1 });
					} else {
						resolve({ code: missing[0] });
					}
				}
				// tslint:disable-next-line: no-console
				// console.log(missing);
			})
			.catch((err) => {
				reject(err);
			});
	});
export { getNewCode };
