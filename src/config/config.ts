// tslint:disable-next-line: no-implicit-dependencies
require('dotenv').config(); // instatiate environment variables

const CONFIG: any = {
	app: '',
	port: '',
	db_dialect: '',
	db_host: '',
	db_port: '',
	db_name: '',
	db_user: '',
	db_password: '',
	jwt_encryption: '',
	jwt_expiration: 0,
	bcrypt_salt: 11 || ''
}; // Make this global to use all over the application

const env = process.env.NODE_ENV || 'dev';

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'root';

CONFIG.bcrypt_salt = process.env.BCRYPT_SALT || 11;
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION;
CONFIG.jwt_expiration = parseInt(process.env.JWT_EXPIRATION, 10);

CONFIG.FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
CONFIG.STORAGE_BUCKET = process.env.STORAGE_BUCKET;

export default CONFIG;
