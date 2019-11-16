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

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || '35.222.101.219';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'polzDB';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'Az123456789';

CONFIG.bcrypt_salt = process.env.BCRYPT_SALT || 11;
CONFIG.jwt_encryption =
	process.env.JWT_ENCRYPTION ||
	'dhjdgsjgseirughdhjgkdfhkjhdhgjhdfjhgdjfghksjdgjhbgjxbdmfhjhdgsjbds';
CONFIG.jwt_expiration = parseInt(process.env.JWT_EXPIRATION, 10) || 604800;

CONFIG.FIREBASE_SERVICE_ACCOUNT =
	process.env.FIREBASE_SERVICE_ACCOUNT ||
	'{"type":"service_account","project_id":"polz-c9d90","private_key_id":"ecd0de248297e3cfe2e8edd30e3ffa746128c199","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdik/qG5eZRkJu\nXHPfJBkQXKIjoJjgRqN6l1w0vKfAcHS7RYfq4NI2ggTkNoY3iWZDJSUnb/guAwf2\nM9rj1eC7qef2lnGRIKlA7pW6Euicti4fLng2mRQuqyK3D6lvww6xslDTJbkB7oZ8\n6ztjjttEGY+M1Ee4JieqVu2G+yTnK+iLcV18jMjXkJa41WUn8oGH4y0SS1zg42FQ\nkshpEuZ4Vzl/HdVYtP5XmqmzXUhzHRdiWacFBoyF+e6OiD+j7Niwd0ixFGwDkAI0\n+ufrR3to82Zs72FhWITI09YFNb98hNw3WdRiC1wjSQcpuWXcvILnDGQcRag1q3SN\neXOXpF9BAgMBAAECggEAAOWdUhzFWo/r96ci2T/CPUW7vhZvXGKGkn97XMkArv+s\n6HaLQS71v23y025MihMoEASNfzmb2P43LMOLkN3CPWtImO6vF5ePIyGgnFo4dRDz\n9wU7lbr+IoxiopZuHWbnxeL5IxSdRqmqHhq0QDs7XBpFpxR70ox0EBwV1t2F7qN+\n8Id0IckeSIiGB6t6gd0p/PWq11RZLyGYgSBcbzz+8HSvxshj1nkLJy1rTWvzf+b1\nTkHrM8WfAKpVvlaW10YGIi3mf1E8Y2kWor9ipWhW2Msy/dIXuhYFFr5Q8NOaVytI\npsjmWbIUf9oNzMdzw7R3nmXpiqDDS00DiOqptuAguQKBgQDZkbaJNzjJ7kGuGJkB\nbT+pSEqkRSe4qWm7x05lxS1oJqdPAaqv5TaPSYWMuuyJdrTiGSmL7n2f3ZQbyIZE\ntm1KAHY50k72uGcLsNd1gGnvwLvlKmNm0rGSyDF8dr3zIsbooFJk3M+3vBhRegSz\nGoC2hGewPqMcDfguClGJ/hUduQKBgQC5XiUQT8p4wtkHMjJ9vM+XPdwUgpFSaeID\nCTsUySo9FlbSPYdNrpRjaUirh9UOVK9rbOHrGhYoaLPCBEzQOgFLI5aXgu57oBSb\nCOJBPw0OApQalssRKV6HIjt6/dfSro+tY7VEvtO8dpdDTvb2ZyquYAyaHAhQl6p4\nC3fAwCzRyQKBgClpPK8dXafBu6qhb+3/l1BnPB3MM+VICaH+K4PfZecfBFVbYduc\n6yeWvN6ubXs0pvUqCOhjenHFQP2Qy02k02R0dgxHZVQ8gRCOllP9HyzNKHZT/RuD\nGt1vUUv5ZeozQlzgtw4PoVG9cXuAmAhnEPyscvfu1Cjw174bpK15ORexAoGASwB5\ntKjkPopwL8Yywcdko0hHRREzZYosBZh1jEp8yazBQl3c4iSSK8sMuULDhQHk3G14\n15x9fKoomYcN4W6m2VUz+GfkwKabz8L/cPDnAlUuwbdjwLThZ4IFWRVefwNcZQaj\n8IXZvDarq3NG35oMnfOFBdHz11AWjG3vbVEUkWkCgYEAoGiRHdGVjUARbtAtDyxM\nxOgnk2Id7Zw7TMITDOcFQBmFAG+y/+eUMRuph66j/xqQHOd7sMnovE/dJl0FGC5e\nDvFCAQ0E5tlkL/JSiVa7S1ZPCcJAOnGdPbtOrt1NJ+YAzdTuwOK1mfvOyNmJMwTV\n4Tj9U18fFUj029MsnvvDiNc=\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-y1wf6@polz-c9d90.iam.gserviceaccount.com","client_id":"104647621370178009182","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-y1wf6%40polz-c9d90.iam.gserviceaccount.com"}';
CONFIG.STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'polz-c9d90.appspot.com';

export default CONFIG;
