import errorHandler from 'errorhandler';

import app from './app';
import { createServer } from 'http';
import { resetDb } from './datastores/cloud-sql';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
// const server = app.listen(app.get('port'), () => {
// 	// console.log(
// 	// 	'  App is running at http://localhost:%d in %s mode',
// 	// 	app.get('port'),
// 	// 	app.get('env')
// 	// );
// 	// console.log('  Press CTRL-C to stop\n');
// });

// tslint:disable-next-line: space-before-function-paren
// const server = async () => {
// 	await sequelize.sync({ force: true });
// 	return app.listen(app.get('port'), () => {
// 		// tslint:disable-next-line: no-console
// 		console.log(
// 			'  App is running at http://localhost:%d in %s mode',
// 			app.get('port'),
// 			app.get('env')
// 		);
// 	});
// };

const port = app.get('port');
const server = (async() => {
	await resetDb();
	// tslint:disable-next-line: no-console
	createServer(app).listen(port, () => console.log(`Server listen on port ${port}`));
})();

export default server;
