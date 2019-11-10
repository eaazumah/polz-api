import errorHandler from 'errorhandler';

import app from './app';
import { createServer } from 'http';
import { syncDb, resetDb } from './datastores/cloud-sql';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
require('./datastores/cloud-sql');
const server = app.listen(app.get('port'), () => {
	// tslint:disable-next-line: no-console
	console.log(
		'  App is running at http://localhost:%d in %s mode',
		app.get('port'),
		app.get('env')
	);
	// tslint:disable-next-line: no-console
	console.log('  Press CTRL-C to stop\n');
});

const port = app.get('port');
// const server = (async () => {
// 	await syncDb();
// 	// await resetDb();
// 	// tslint:disable-next-line: no-console
// 	createServer(app).listen(port, () => console.log(`Server listen on port ${port}`));
// })();

export default server;
