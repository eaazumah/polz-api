const decodeSession = (session: string) => {
	let code: number = null;
	let state: number[] = [];
	// tslint:disable-next-line: no-console
	console.log('session');
	// tslint:disable-next-line: no-console
	console.log(session.split('*'));
	code = parseInt(session.split('*')[1], 10);
	state = session.split('*')[2].split('').map(Number);
	// tslint:disable-next-line: no-console
	console.log('state');
	// tslint:disable-next-line: no-console
	console.log(state);
	return { code, state };
};

export { decodeSession };
