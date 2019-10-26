// import { Sequelize } from 'sequelize'; // Option 1: Passing parameters separately
// export const sequelize = new Sequelize('polzDB', 'root', 'Az123456789', {
// 	host: 'localhost',
// 	dialect: 'mysql'
// });

import { Sequelize } from 'sequelize-typescript';
import { User, Category, Poll, Participant, Vote } from '../models';
import logger from '../util/logger';

const sequelize = new Sequelize({
	database: 'polzDB',
	dialect: 'mysql',
	username: 'root',
	password: 'Az123456789',
	models: [
		User,
		Poll,
		Category,
		Participant,
		Vote
	]
});

// tslint:disable-next-line: space-before-function-paren
const resetDb = async (): Promise<boolean> => {
	try {
		await sequelize.sync({ force: true });
		logger.debug('DB: Database initialized');
	} catch (ex) {
		logger.error('DB: ERROR initializing database');
		logger.error(ex);
		return false;
	}
	return true;
};

// tslint:disable-next-line: space-before-function-paren
const syncDb = async (): Promise<boolean> => {
	try {
		await sequelize.sync({ force: false });
		logger.debug('DB: Database initialized');
	} catch (ex) {
		logger.error('DB: ERROR initializing database');
		logger.error(ex);
		return false;
	}
	return true;
};

export { sequelize, Sequelize };
export { User, Poll, Category, Participant, Vote };
export { resetDb, syncDb };
