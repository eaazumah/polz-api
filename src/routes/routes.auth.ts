const express = require('express');
import CONFIG from '../config/config';
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

/* POST login. */
router.post(
	'/login',
	(
		req: {
			login: (
				arg0: Express.User,
				arg1: { session: boolean },
				arg2: (err: any) => any
			) => void;
		},
		res: {
			status: (
				arg0: number
			) => { json: (arg0: { message: string; user: Express.User }) => void };
			send: (arg0: any) => void;
			json: (arg0: { user: Express.User; token: any }) => void;
		},
		next: any
	) => {
		passport.authenticate(
			'local',
			{ session: false },
			(err: any, user: Express.User, info: any) => {
				if (err) {
					return res.status(400).json({
						message: err.message,
						user
					});
				}
				if (!user) {
					return res.status(400).json({
						message: info.message,
						user
					});
				}

				req.login(user, { session: false }, (error: any) => {
					if (error) {
						res.send(error);
					}
					// generate a signed son web token with the contents of user object and return it in the response
					const token = jwt.sign({ user: JSON.stringify(user) }, CONFIG.jwt_encryption, {
						expiresIn: CONFIG.jwt_expiration // 1 week
					});
					return res.json({ user, token });
				});
			}
		)(req, res, next);
	}
);

export default router;
