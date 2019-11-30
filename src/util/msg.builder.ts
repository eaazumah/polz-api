const msgBuilder = (state: number[], poll: any): string => {
	const categoryLength = poll.categories.length;
	let msg: string = '';
	// tslint:disable-next-line: no-console
	// console.log(state);
	// tslint:disable-next-line: no-console
	// console.log(poll);
	if (categoryLength > 1) {
		if (state.length === 0) {
			msg = 'Please select category to vote';
			poll.categories.map((item: { name: string }, index: number) => {
				msg = msg + '\n' + (index + 1) + ')' + item.name;
			});
			// tslint:disable-next-line: no-console
			// console.log(msg);
			if (!msg) {
				msg = 'No categories available';
			}
			return msg;
		} else if (state.length === 1) {
			msg = 'Please select your participant for' + poll.categories[state[0] - 1].name;
			poll.categories[
				state[0] - 1
			].participants.map((item: { name: string }, index: number) => {
				msg = msg + '\n' + (index + 1) + ')' + item.name;
			});
			if (!msg) {
				msg = 'No participants available';
			}
			// tslint:disable-next-line: no-console
			// console.log(msg);
			return msg;
		} else if (state.length === 2) {
			// const sessionArray = session.slice(6).split('').map(Number);
			// console.log(sessionArray);
			// tslint:disable-next-line: no-console
			// console.log(msg);
			return msg;
		}
	}
	// else {
	// 	if (state.length === 0) {
	// 		msg = 'Please select your participant for' + poll.categories[0].name;
	// 		poll.categories[0].participants.map((item: { name: string }, index: number) => {
	// 			msg = msg + '\n' + (index + 1) + ')' + item.name;
	// 		});
	// 		// tslint:disable-next-line: no-console
	// 		console.log(msg);
	// 		return msg;
	// 	} else if (state.length === 6) {
	// 		// console.log(sessionArray);
	// 		// tslint:disable-next-line: no-console
	// 		console.log(msg);
	// 		return msg;
	// 	}
	// }
};

export default msgBuilder;
