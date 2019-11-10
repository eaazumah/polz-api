import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import userRouter from './routes/routes.users';
import pollRouter from './routes/routes.polls';
import categoryRouter from './routes/routes.category';
import ussdRouter from './routes/routes.ussd';
import authRouter from './routes/routes.auth';
import participantRouter from './routes/routes.participants';
const swaggerUi = require('swagger-ui-express');
import swaggerDocument from './swagger.json';

const passport = require('passport');

require('./config/passport');

// API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser({ limit: '10MB' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Expose-Headers', 'x-total-count');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
	res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
	next();
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Primary app routes.
 */

/**
 * API examples routes.
 */
app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', pollRouter);
app.use('/api/v1', passport.authenticate('jwt', { session: false }), categoryRouter);
app.use('/api/v1', passport.authenticate('jwt', { session: false }), participantRouter);
app.use('/api/v1', ussdRouter);

/**
 * OAuth authentication routes. (Sign in)
 */

export default app;
