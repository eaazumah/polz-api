import { Sequelize } from 'sequelize-typescript';
import { User, Category, Poll, Participant, Vote } from '../models';
import CONFIG from '../config/config';
import logger from '../util/logger';

const sequelize = new Sequelize({
	database: CONFIG.db_name,
	dialect: CONFIG.db_dialect as 'mysql' | 'postgres',
	username: CONFIG.db_user,
	password: CONFIG.db_password,
	host: CONFIG.db_host,
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
