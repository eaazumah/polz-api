const menu = (session: any, poll: any): string => {
	const categoryLength = poll.categories.length;
	let msg: string = '';
	if (categoryLength > 1) {
		if (session.length === 5) {
			msg = 'Please select category to vote';
			poll.categories.map((item: { title: string }, index: number) => {
				msg = msg + '\n' + (index + 1) + ')' + item.title;
			});
		} else if (session.length === 6) {
			const sessionArray = session.slice(5).split('').map(Number);
			msg = 'Please select your participant for' + poll.categories[sessionArray[0] - 1].title;
			poll.categories[
				sessionArray[0] - 1
			].participants.map((item: { name: string }, index: number) => {
				msg = msg + '\n' + (index + 1) + ')' + item.name;
			});
		} else if (session.length === 7) {
			const sessionArray = session.slice(6).split('').map(Number);
			// console.log(sessionArray);
		}
	} else {
		if (session.length === 5) {
			msg = 'Please select your participant for' + poll.categories[0].title;
			poll.categories[0].participants.map((item: { name: string }, index: number) => {
				msg = msg + '\n' + (index + 1) + ')' + item.name;
			});
		} else if (session.length === 6) {
			const sessionArray = session.slice(5).split('').map(Number);
			// console.log(sessionArray);
		}
	}

	return msg;
};

export default menu;
